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
                            <el-input-number v-model="config.riskFreeRate" :min="0" :max="100" :step="0.125" />
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
                    <!-- <el-col :span="12">
                        <el-form-item label="稅後收入">
                            <el-input-number v-model="career.postTaxMonthlyIncome" :min="0" :step="1000" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="增長率%">
                            <el-input-number v-model="career.growthRate" :min="0" :max="100" :step="0.1" />
                        </el-form-item>
                    </el-col> -->
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
                        <el-input-number v-model="retirement.age" :min="50" :max="70" :step="5" />
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
                <el-table-column prop="startDate" label="開始年">
                    <template #default="scope">
                        <el-date-picker v-model="scope.row.startDate" type="year"
                            :disabled="['理財收入', '退休後收入', '退休後支出'].includes(scope.row.name)" />
                    </template>
                </el-table-column>
                <el-table-column prop="pmt" label="現金流">
                    <template #default="scope">
                        <el-input-number v-model="scope.row.pmt"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="n" label="為期n年">
                    <template #default="scope">
                        <el-input-number v-model="scope.row.n"
                            :disabled="['理財收入', '退休後收入', '退休後支出', '購房首付'].includes(scope.row.name)"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="yield" label="現金流增長率">
                    <template #default="scope">
                        <el-input-number v-model="scope.row.yield"></el-input-number>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-card>
            <canvas id="yieldChart"></canvas>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import Chart from 'chart.js/auto';
import debounce from 'debounce';

const config = ref({
    riskFreeRate: 2,
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
        startDate: new Date().toISOString(),
        pmt: 2000,
        n: 0,
        yield: 2,
    },
    {
        name: '退休後收入',
        startDate: '',
        pmt: 0,
        n: 0,
        yield: 2,
    },
    // 流出
    {
        name: '退休後支出',
        startDate: '',
        pmt: -30000,
        n: 0,
        yield: 2,
    },
    {
        name: '購房首付',
        startDate: new Date().toISOString(),
        pmt: -3000000,
        n: 1,
        yield: 2,
    },
    {
        name: '購房貸款',
        startDate: new Date().toISOString(),
        pmt: -30000,
        n: 30,
        yield: 2,
    },
])

// methods
function onProfileChanged() {
    const financeIncome = financeGoals.value.find(item => {
        return item.name === '理財收入'
    })
    if (financeIncome) {
        const { age, lifeExpectancy } = retirement.value
        const n = age + lifeExpectancy - profile.value.age
        financeIncome.n = n
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
        retirementIncome.startDate = date.toISOString()
        retirementIncome.n = retirement.value.lifeExpectancy
    }

    const retirementExpense = financeGoals.value.find(item => {
        return item.name === '退休後支出'
    })
    if (retirementExpense) {
        retirementExpense.startDate = date.toISOString()
        retirementExpense.n = retirement.value.lifeExpectancy
    }
}

function onEstateChanged() {
    const date = new Date()
    let currentYear = date.getFullYear()
    currentYear += 3
    date.setFullYear(currentYear)

    const estateMortgage = financeGoals.value.find(item => {
        return item.name === '購房首付'
    })
    if (estateMortgage) {

    }
}

let chartRef = ref<Chart>()

function drawYieldChart() {
    let canvas = null
    if (chartRef.value) {
        canvas = chartRef.value.canvas
    }

    const chartData = {
        datasets: [],
        labels: []
    }

    // 繪圖
    if (chartRef.value) {
        chartRef.value.data = chartData
        chartRef.value.update()
    } else {
        const ctx: any = document.getElementById('yieldChart')
        const chartInstance = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                    },
                }
            }
        })
        chartRef = shallowRef(chartInstance)
    }
}

onMounted(() => {
    if (window.origin === 'http://localhost:3000') {

    }
    onProfileChanged()
    onReqirementChanged()
    onEstateChanged()
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