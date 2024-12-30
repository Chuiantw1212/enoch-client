<template>
    <h1>速算多目標理財規劃</h1>

    <div class="calculator">
        <el-card>
            <template #header>
                基本資料
            </template>
            <el-form>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="目前年齡">
                            <el-input-number v-model="profile.age" :min="0" :max="120" :step="5" />
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

        <el-card>
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

        <el-card>
            <template #header>
                退休
            </template>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="預計退休">
                        <el-input-number v-model="retirement.age" :min="0" :max="70" :step="5" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="退休後餘命">
                        <el-input-number v-model="retirement.lifeExpectancy" :min="0" :max="120" :step="5" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-card>

        <el-card>
            <template #header>
                生息資產
            </template>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="生息資產">
                        <el-input-number v-model="security.presentValue" :min="0" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="投資報酬率%">
                        <el-input-number v-model="security.presentIrr" :min="0" :max="100" :step="0.1" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
const config = ref({
    riskFreeRate: 0,
})

const profile = ref({
    age: 0,
})

const career = ref({
    postTaxMonthlyIncome: 0,
    growthRate: 0,
})

const retirement = ref({
    age: 0,
    income: 0,
    lifeExpectancy: 0,
})

const security = ref({
    presentValue: 0,
    presentIrr: 0,
    expectedIrr: 0,
})
</script>
<style lang="scss" scoped>
.calculator {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;

    >* {
        width: 100%;
    }
}

@media screen and (min-width:996px) {
    .calculator {
        >* {
            width: calc(50% - 8px);
        }
    }
}
</style>