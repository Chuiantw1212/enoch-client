<template>
    <h1>速算多目標理財規劃</h1>
    <el-row :justify="'center'">
        <el-col>
            <el-card>
                <el-form>
                    <el-form-item label="目前年齡">
                        <el-input-number v-model="profile.age" :min="0" :max="120" :step="5" />
                    </el-form-item>
                    <el-form-item label="預計退休">
                        <el-input-number v-model="retirement.age" :min="0" :max="70" :step="5" />
                    </el-form-item>
                    <el-form-item v-model="security.presentValue" label="現有生息資產">
                        <el-input-number v-model="security.presentValue" :min="0" :step="100000" />
                    </el-form-item>
                    <el-form-item label="退休前稅後收入">
                        <el-input-number v-model="career.postTaxMonthlyIncome" :min="0" :step="1000" />
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>
    </el-row>
    <el-row :justify="'center'">
        <el-col>
            <el-card>
                <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
                <template #footer>Footer content</template>
            </el-card>
        </el-col>
    </el-row>
    <el-row :justify="'center'">
        <el-col>
            <el-card>
                <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
                <template #footer>Footer content</template>
            </el-card>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
const profile = ref({
    age: 0,
})

const career = ref({
    postTaxMonthlyIncome: 0
})

const retirement = ref({
    age: 0,
    income: 0,
})

const security = ref({
    presentValue: 0,

})
</script>