<template>
    <div class="calculator">
        <h1 class="calculator__header">
            速算多目標理財規劃
        </h1>
        <div class="calculator__container">
            <el-card class="calculator__card">
                <template #header>
                    基本資料
                </template>
                <el-form>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="目前年齡">
                                <el-input-number v-model="profile.age" :min="0" :max="120" Ｆ
                                    @change="onProfileChanged()">
                                    <template #suffix>
                                        歲
                                    </template>
                                </el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="無風險利率">
                                <el-input-number v-model="config.riskFreeRatePerYear" :min="0" :max="100" :step="0.125">
                                    <template #suffix>
                                        %
                                    </template>
                                </el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>

            <el-card class="calculator__card">
                <template #header>
                    職涯
                </template>
                <el-form>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="稅後收入">
                                <el-input-number v-model="career.postTaxMonthlyIncome" :min="0" :step="1000" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="增長率">
                                <el-input-number v-model="career.growthRate" :min="0" :max="100" :step="0.1">
                                    <template #suffix>
                                        %
                                    </template>
                                </el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>

            <el-card class="calculator__card">
                <template #header>
                    退休
                </template>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="預計退休">
                            <el-input-number v-model="retirement.age" :min="50" :max="70" Ｆ
                                @change="onReqirementChanged()">
                                <template #suffix>
                                    歲
                                </template>
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退休後餘命">
                            <el-input-number v-model="retirement.lifeExpectancy" :min="0" :max="120" Ｆ
                                @change="onReqirementChanged()">
                                <template #suffix>
                                    年
                                </template>
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>

            <el-card class="calculator__card">
                <template #header>
                    生息資產
                </template>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="現有資產">
                            <el-input-number v-model="security.presentValue" :min="0" :step="100000"
                                @click="onAssetChanged()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="投資報酬率">
                            <el-input-number v-model="security.presentIrr" :min="0" :max="100" :step="0.1"
                                @click="onAssetChanged()">
                                <template #suffix>
                                    %
                                </template>
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>

            <el-card class="calculator__card calculator__card--100">
                <el-table :data="financeGoals" style="width: 100%">
                    <el-table-column prop="name" label="理財目標">
                        <template #default="scope">
                            <el-select v-model="scope.row.name">
                                <el-option v-for="item in financeGoalNames" :key="item" :label="item.label"
                                    :value="item" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="startAge" label="開始年齡">
                        <template #default="scope">
                            <el-input-number v-model="scope.row.startAge"
                                :disabled="['理財收入', '退休後收入', '退休後支出'].includes(scope.row.name)"
                                @change="updateAllCharts()">
                                <template #suffix>
                                    歲
                                </template>
                            </el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pmt" label="現金流">
                        <template #default="scope">
                            <el-input-number v-model="scope.row.pmt" :step="10000"
                                @change="updateAllCharts()"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column prop="n" label="持續年期">
                        <template #default="scope">
                            <el-input-number v-model="scope.row.n"
                                :disabled="['理財收入', '退休後收入', '退休後支出', '購房首付'].includes('')" @change="updateAllCharts()">
                                <template #suffix>
                                    年
                                </template>
                            </el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ratePerYear" label="現金流增長率">
                        <template #default="scope">
                            <el-input-number v-model="scope.row.ratePerYear" @change="updateAllCharts()">
                                <template #suffix>
                                    %
                                </template>
                            </el-input-number>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

            <el-card class="calculator__card calculator__card--100">
                <template #header>
                    現金流量表
                </template>
                <el-row justify="center">
                    <canvas class="calculator__chart" id="cashFlowChart"></canvas>
                </el-row>
            </el-card>

            <el-card class="calculator__card calculator__card--100">
                <template #header>
                    不同報酬率 / 資產變化比較表
                </template>
                <el-row justify="center">
                    <canvas class="calculator__chart" id="assetChart"></canvas>
                </el-row>
            </el-card>

            <el-card>
                <template #header>
                    試算結果
                </template>
                <el-form-item label="所需報酬率">
                    <el-input-number v-model="security.expectedIrr" :disabled="true">
                        <template #suffix>
                            %
                        </template>
                    </el-input-number>
                </el-form-item>
                <template #footer>
                    <el-button @click="exportAsPdf()">
                        匯出
                    </el-button>
                </template>
            </el-card>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Chart, { type TooltipItem } from 'chart.js/auto';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import NotoSansTC from '~/public/NotoSansTC-VariableFont_wght.ttf'

const config = ref({
    riskFreeRatePerYear: 2,
})

const profile = ref({
    age: 34,
})

const career = ref({
    postTaxMonthlyIncome: 60000,
    growthRate: 2,
})

const retirement = ref({
    age: 70,
    income: 42000,
    lifeExpectancy: 18,
})

const security = ref({
    presentValue: 6000000,
    presentIrr: 5,
    expectedIrr: 0,
})

// goals
const financeGoalNames = ref(['理財收入', '退休後收入', '退休後支出', '購房貸款', '購房首付'])

const financeGoals = ref([
    // 流入
    {
        name: '理財收入',
        startAge: 0,
        pmt: 200000,
        n: 0,
        ratePerYear: 2,
    },
    {
        name: '退休後收入',
        startAge: 0,
        pmt: 300000,
        n: 0,
        ratePerYear: 2,
    },
    // 流出
    {
        name: '退休後支出',
        startAge: 0,
        pmt: -360000,
        n: 0,
        ratePerYear: 2,
    },
    {
        name: '購房貸款',
        startAge: 35,
        pmt: -360000,
        n: 30,
        ratePerYear: 2,
    },
    {
        name: '購房首付',
        startAge: 35,
        pmt: -3000000,
        n: 1,
        ratePerYear: 2,
    },
])

interface IDatasets {
    label: string,
    ratePerYear?: number,
    data: number[],
    stacked: boolean,
    fill: boolean,
}

const cashflowDatasets = ref<IDatasets[]>([])
const netCashflows = ref<number[]>([])

// methods
function onProfileChanged() {
    const financeIncome = financeGoals.value.find(item => {
        return item.name === '理財收入'
    })
    if (financeIncome) {
        const n = retirement.value.age - profile.value.age
        financeIncome.startAge = profile.value.age
        financeIncome.n = n
        debouncedrawAssetChart()
        drawCashFlowChart()
    }
}

function onReqirementChanged() {
    const date = new Date()
    let currentYear = date.getFullYear()
    currentYear += retirement.value.lifeExpectancy
    date.setFullYear(currentYear)

    const retirementIncome = financeGoals.value.find(item => {
        return item.name === '退休後收入'
    })
    if (retirementIncome) {
        retirementIncome.startAge = retirement.value.age
        retirementIncome.n = retirement.value.lifeExpectancy
    }

    const retirementExpense = financeGoals.value.find(item => {
        return item.name === '退休後支出'
    })
    if (retirementExpense) {
        retirementExpense.startAge = retirement.value.age
        retirementExpense.n = retirement.value.lifeExpectancy
    }
}

function onAssetChanged() {
    drawAssetChart()
}

function onEstateChanged() {
    // const date = new Date()
    // let currentYear = date.getFullYear()
    // currentYear += 3
    // date.setFullYear(currentYear)

    // const estateMortgage = financeGoals.value.find(item => {
    //     return item.name === '購房首付'
    // })
    // if (estateMortgage) {

    // }
}

function updateAllCharts() {
    drawCashFlowChart()
    drawAssetChart()
}


let cashFlowChartRef = ref<Chart>()

function drawCashFlowChart() {
    const labels: string[] = []
    const lifeExpectancy = retirement.value.age + retirement.value.lifeExpectancy

    // 計算目標PMT
    const datasets: IDatasets[] = financeGoals.value.map(item => {
        const data = []
        for (let i = 0; i < lifeExpectancy - profile.value.age; i++) {
            const simAge = i + profile.value.age
            labels[i] = `${simAge}歲`
            const isStarted = simAge >= item.startAge
            const isEnded = simAge > item.startAge + item.n - 1
            if (isStarted && !isEnded) {
                let itemRatePerYear = 1 + item.ratePerYear / 100
                itemRatePerYear = Math.pow(itemRatePerYear, i)
                const pmt = item.pmt * itemRatePerYear
                data.push(pmt)
            } else {
                data.push(0)
            }
        }

        return {
            label: item.name,
            ratePerYear: item.ratePerYear,
            data,
            stacked: true,
            fill: true,
        }
    })
    // 計算淨現金流
    netCashflows.value = datasets.reduce((accumulator: number[], currentValue) => {
        const sum: number[] = accumulator
        const data = currentValue.data
        data.forEach((number, index) => {
            const pmt = number
            if (sum[index]) {
                sum[index] += pmt
            } else {
                sum[index] = pmt
            }
        })
        return sum as number[]
    }, [])
    // const netCashflowDataset = {
    //     label: '淨現金流',
    //     data: netCashflows,
    //     stacked: true,
    //     fill: true,
    // }
    // labels.push('淨現金流')
    cashflowDatasets.value = [...datasets,]

    // 繪圖
    const chartData = {
        datasets: cashflowDatasets.value,
        labels,
    }
    if (cashFlowChartRef.value) {
        cashFlowChartRef.value.data = chartData
        cashFlowChartRef.value.update()
    } else {
        const ctx: any = document.getElementById('cashFlowChart')
        const chartInstance = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: formatToolTip
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '年齡'
                        }
                    },
                    y: {
                        stacked: true,
                        title: {
                            display: true,
                            text: '現金流'
                        }
                    }
                }
            },
        })
        cashFlowChartRef = shallowRef(chartInstance)
    }
}

let assetChartRef = ref<Chart>()

function debouncedrawAssetChart() {
    drawAssetChart()
}

function drawAssetChart() {
    let canvas = null
    if (assetChartRef.value) {
        canvas = assetChartRef.value.canvas
    }

    const labels = []
    const { riskFreeRatePerYear } = config.value
    const lifeExpectancy = retirement.value.age + retirement.value.lifeExpectancy

    // 計算現金流量表
    const cashflowValues: number[] = cashflowDatasets.value.reduce((accumulator: number[], currentValue) => {
        const sum: number[] = accumulator
        const data = currentValue.data
        data.forEach((number, index) => {
            if (sum[index]) {
                sum[index] += number
            } else {
                sum[index] = number
            }
        })
        return sum as any
    }, [])

    // 無風險利率 
    const riskFreeData: number[] = []
    const riskFree = {
        pv: security.value.presentValue,
        pmt: 0,
        fv: 0
    }

    for (let i = 0; i < lifeExpectancy - profile.value.age; i++) {
        const simAge = i + profile.value.age
        labels.push(`${simAge}歲`)
        // 計算pmt
        riskFree.pmt = cashflowValues[i]
        // 計算fv
        riskFree.fv = riskFree.pv + riskFree.pmt
        // 紀錄fv
        riskFreeData.push(Math.max(riskFree.fv, 0))
        // 更新並回存pv
        riskFree.fv *= (1 + riskFreeRatePerYear / 100)
        riskFree.pv = riskFree.fv
    }

    // 目前投資報酬率
    const currentReturnData: number[] = []
    const currentReturn = {
        pv: security.value.presentValue,
        pmt: 0,
        fv: 0,
    }
    for (let i = 0; i < lifeExpectancy - profile.value.age; i++) {
        // 計算pmt
        currentReturn.pmt = cashflowValues[i]
        // 計算fv
        currentReturn.fv = currentReturn.pv + currentReturn.pmt
        // 紀錄fv
        currentReturnData.push(Math.max(currentReturn.fv, 0))
        // 更新並回存pv
        currentReturn.fv *= (1 + security.value.presentIrr / 100)
        currentReturn.pv = currentReturn.fv
    }

    /** 理想投資報酬率 */
    // 計算每期淨現金流
    const cashflows: number[] = cashflowDatasets.value.reduce((accumulator: number[], currentValue) => {
        const sum: number[] = accumulator
        const data = currentValue.data
        // const returnRatePerYear = (1 + currentValue.ratePerYear / 100)
        data.forEach((number, index) => {
            const pmt = number
            if (sum[index]) {
                sum[index] += pmt
            } else {
                sum[index] = pmt
            }
        })
        return sum as number[]
    }, [])
    const expectedIrr = calculateIRR(cashflows);
    security.value.expectedIrr = expectedIrr

    // 計算資產變化
    const requiredReturnData: number[] = []
    const requiredReturn = {
        pv: security.value.presentValue,
        pmt: 0,
        fv: 0,
    }
    for (let i = 0; i < lifeExpectancy - profile.value.age; i++) {
        // 計算pmt
        requiredReturn.pmt = cashflowValues[i]
        // 計算fv
        requiredReturn.fv = requiredReturn.pv + requiredReturn.pmt
        // 紀錄fv
        requiredReturnData.push(requiredReturn.fv)
        // 更新並回存pv
        requiredReturn.fv *= (1 + security.value.expectedIrr / 100)
        requiredReturn.pv = requiredReturn.fv
    }

    // 資料集
    const datasets = [
        {
            label: '無風險利率',
            data: riskFreeData,
        },
        {
            label: '現有投資率',
            data: currentReturnData,
        },
        {
            label: '所需報酬率',
            data: requiredReturnData,
        },
    ]

    const chartData = {
        datasets,
        labels,
    }

    // 繪圖
    if (assetChartRef.value) {
        assetChartRef.value.data = chartData
        assetChartRef.value.update()
    } else {
        const ctx: any = document.getElementById('assetChart')
        const chartInstance = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: formatToolTip
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '年齡'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '資產變化'
                        }
                    }
                }
            },
        })
        assetChartRef = shallowRef(chartInstance)
    }
}

function formatToolTip(tooltipItems: TooltipItem<any>) {
    const { raw, dataset, } = tooltipItems
    const { label } = dataset
    const formatNumber = Math.round(raw as number / 10000)
    const formatString = formatNumber.toLocaleString()
    return `${label}:${formatString}萬`
}

async function exportAsPdf() {
    print()
    // const dom: any = document.querySelector(".calculator")
    // if (dom) {
    //     const canvas = await html2canvas(dom)
    //     document.body.appendChild(canvas)
    // }
    // html2canvas().then(canvas => {
    //     document.body.appendChild(canvas)
    // });
    // const doc = new jsPDF();
    // doc.addFileToVFS("NotoSansTC.ttf", NotoSansTC);
    // doc.addFont("NotoSansTC.ttf", "NotoSansTC", "normal");
    // doc.setFont("NotoSansTC");

    // doc.html(document.body, {
    //     callback: function (doc) {
    //         doc.save();
    //     },
    //     windowWidth: 768,
    // });
}

function calculateIRR(CArray: number[]) {
    let min = 0.0;
    let max = 1.0;
    let c = 0;
    let guest = 0
    let NPV = 0
    do {
        guest = (min + max) / 2;
        NPV = 0;
        for (var j = 0; j < CArray.length; j++) {
            NPV += CArray[j] / Math.pow((1 + guest), j);
        }
        if (NPV > 0) {
            min = guest;
            c++;
        }
        else {
            max = guest;
            c++;
        }

        if (c >= 15) { return guest * 100; }
    } while (Math.abs(NPV) > 0.000001);
    return guest * 100;
}

// // Example usage:
// const cashflows = [-1000, 200, 300, 400, 500]; // Initial investment followed by cash inflows
// try {
//     const irr = calculateIRR(cashflows);
//     console.log(`Calculated IRR: ${(irr * 100).toFixed(2)}%`);
// } catch (error) {
//     console.error(error.message);
// }

onMounted(() => {
    if (window.origin === 'http://localhost:3000') {

    }
    onProfileChanged()
    onReqirementChanged()
    onEstateChanged()
    updateAllCharts()
})

</script>
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap');

.calculator__header {
    font-family: "Noto Sans TC", serif;
}

.calculator__container {
    font-family: "Noto Sans TC", serif;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 11px;

    .calculator__card {
        width: 100%;
    }

    .calculator__chart {
        width: 100%;
    }
}

@media screen and (min-width:996px) {
    .calculator__container {
        .calculator__card {
            width: calc(50% - 8px);
        }

        .calculator__card--100 {
            width: 100%;
        }
    }
}
</style>
