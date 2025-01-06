<template>
    <h1>速算多目標理財規劃</h1>

    <div class="calculator">
        <el-card class="calculator__card">
            <template #header>
                基本資料
            </template>
            <el-form>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="目前年齡">
                            <el-input-number v-model="profile.age" :min="0" :max="120" :step="5"
                                @change="onProfileChanged()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="無風險利率%">
                            <el-input-number v-model="config.riskFreeYield" :min="0" :max="100" :step="0.125" />
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
                        <el-form-item label="增長率%">
                            <el-input-number v-model="career.growthRate" :min="0" :max="100" :step="0.1" />
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
                        <el-input-number v-model="retirement.age" :min="50" :max="70" :step="5"
                            @change="onReqirementChanged()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="退休後餘命">
                        <el-input-number v-model="retirement.lifeExpectancy" :min="0" :max="120" :step="5"
                            @change="onReqirementChanged()" />
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
                        <el-input-number v-model="security.presentValue" :min="0" :step="100000" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="投資報酬率%">
                        <el-input-number v-model="security.presentIrr" :min="0" :max="100" :step="0.1" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-card>

        <el-card class="calculator__card calculator__card--100">
            <el-table :data="financeGoals" style="width: 100%">
                <el-table-column prop="name" label="理財目標">

                </el-table-column>
                <el-table-column prop="startAge" label="開始年齡">
                    <template #default="scope">
                        <el-input-number v-model="scope.row.startAge"
                            :disabled="['理財收入', '退休後收入', '退休後支出'].includes(scope.row.name)"
                            @change="updateAllCharts()"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="pmt" label="現金流">
                    <template #default="scope">
                        <el-input-number v-model="scope.row.pmt" @change="updateAllCharts()"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="n" label="為期n年">
                    <template #default="scope">
                        <el-input-number v-model="scope.row.n"
                            :disabled="['理財收入', '退休後收入', '退休後支出', '購房首付'].includes(scope.row.name)"
                            @change="updateAllCharts()"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="yield" label="現金流增長率%">
                    <template #default="scope">
                        <el-input-number v-model="scope.row.yield" @change="updateAllCharts()"></el-input-number>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-card class="calculator__card calculator__card--100">
            <template #header>
                現金流量表
            </template>
            <canvas class="calculator__chart" id="cashFlowChart"></canvas>
        </el-card>

        <el-card class="calculator__card calculator__card--100">
            <template #header>
                不同報酬率 / 資產變化比較表
            </template>
            <canvas class="calculator__chart" id="assetChart"></canvas>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import Chart from 'chart.js/auto';
import debounce from 'debounce';

const config = ref({
    riskFreeYield: 2,
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
const financeGoals = ref([
    // 流入
    {
        name: '理財收入',
        startAge: 0,
        pmt: 240000,
        n: 0,
        yield: 2,
    },
    {
        name: '退休後收入',
        startAge: 0,
        pmt: 300000,
        n: 0,
        yield: 2,
    },
    // 流出
    {
        name: '退休後支出',
        startAge: 0,
        pmt: -360000,
        n: 0,
        yield: 2,
    },
    {
        name: '購房貸款',
        startAge: 35,
        pmt: -360000,
        n: 30,
        yield: 2,
    },
    {
        name: '購房首付',
        startAge: 35,
        pmt: -3000000,
        n: 1,
        yield: 2,
    },
])

interface IDatasets {
    label: string,
    yield: number,
    data: number[],
    stacked: boolean,
    fill: boolean,
}

const cashflowDatasets = ref<IDatasets[]>([])

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
    const labels: number[] = []
    const lifeExpectancy = retirement.value.age + retirement.value.lifeExpectancy

    // 計算目標PMT
    const datasets: IDatasets[] = financeGoals.value.map(item => {
        const data = []
        for (let i = 0; i < lifeExpectancy - profile.value.age; i++) {
            const simAge = i + profile.value.age
            labels[i] = simAge
            const isStarted = simAge >= item.startAge
            const isEnded = simAge > item.startAge + item.n - 1
            if (isStarted && !isEnded) {
                let itemYield = 1 + item.yield / 100
                itemYield = Math.pow(itemYield, i)
                const pmt = item.pmt * itemYield
                data.push(pmt)
            } else {
                data.push(0)
            }
        }

        return {
            label: item.name,
            yield: item.yield,
            data,
            stacked: true,
            fill: true,
        }
    })
    cashflowDatasets.value = datasets

    // 繪圖
    const chartData = {
        datasets,
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
    const { riskFreeYield } = config.value
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
        labels.push(i + profile.value.age)
        // 計算pmt
        riskFree.pmt = cashflowValues[i]
        // 計算fv
        riskFree.fv = riskFree.pv + riskFree.pmt
        // 紀錄fv
        riskFreeData.push(Math.max(riskFree.fv, 0))
        // 更新並回存pv
        riskFree.fv *= (1 + riskFreeYield / 100)
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
    // 先算現金流量表FV
    const cashflowFVs: number[] = cashflowDatasets.value.reduce((accumulator: number[], currentValue) => {
        const sum: number[] = accumulator
        const data = currentValue.data
        const returnYield = (1 + currentValue.yield / 100)
        data.forEach((number, index) => {
            const fv = Math.floor(number * Math.pow(returnYield, data.length - index))
            if (sum[index]) {
                sum[index] += fv
            } else {
                sum[index] = fv
            }
        })
        return sum as any[]
    }, [])
    const cashflowFinalSum = cashflowFVs.reduce((sum, number) => {
        return sum + number
    }, 0)
    // 回推理想投資報酬率
    const requiredReturnData: number[] = []
    const requiredReturn = {
        pv: security.value.presentValue,
        pmt: 0,
        fv: cashflowFinalSum,
    }
    const requiredYield = cashflowFinalSum / security.value.presentValue
    console.log({
        requiredYield
    })


    // 資料集
    const datasets = [
        {
            label: '無風險利率',
            data: riskFreeData,
            stacked: true,
        },
        {
            label: '現有投資率',
            data: currentReturnData,
            stacked: true,
        },
        // {
        //     label: '所需報酬率',
        //     data: [],
        //     stacked: true,
        // },
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
            data: chartData
        })
        assetChartRef = shallowRef(chartInstance)
    }
}

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
.calculator {
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
    .calculator {
        .calculator__card {
            width: calc(50% - 8px);
        }

        .calculator__card--100 {
            width: 100%;
        }
    }
}
</style>