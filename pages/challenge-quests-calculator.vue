<template>
  <v-container>
    <v-alert
      type="error"
      transition="fade-transition"
      :value="alertDetails.error.status"
    >
      {{ alertDetails.error.message }}
    </v-alert>
    <v-alert
      type="info"
      transition="fade-transition"
      :value="alertDetails.success.status"
    >
      {{ alertDetails.success.message }}
    </v-alert>
    <span class="d-block mb-5 font-weight-bold">TROOPS TRAINING QUANTITY</span>
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="troopsQuantity"
          placeholder="0"
          solo
          type="number"
          hint="The max amount of troops that you can train."
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn depressed large @click="saveTroopsQuantity"> SAVE </v-btn>
      </v-col>
    </v-row>
    <span class="d-block mb-5 font-weight-bold">POINTS REQUIRED</span>
    <v-radio-group v-model="selectedOption" row @mouseup="clearInputs">
      <v-radio
        v-for="(option, index) in options"
        :key="index"
        :label="option.label"
        :value="option.value"
      ></v-radio>
    </v-radio-group>
    <v-row v-if="selectedOption == 'default'">
      <v-col cols="7">
        <v-autocomplete
          v-model="defaultPointsRequired"
          :items="pointsRequiredDefaultOptions"
          solo
          clearable
          type="number"
          placeholder="Points required to complete the quest."
          @change="computeTroopsCountToTrain"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row v-if="selectedOption == 'custom'">
      <v-col cols="4">
        <v-text-field
          v-model="customPointsRequired"
          placeholder="0"
          solo
          hint="Points required to complete the quest."
          type="number"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn depressed large @click="computeTroopsCountToTrain">
          COMPUTE
        </v-btn>
        <v-btn depressed large @click="clearCustomPointsRequired">
          CLEAR
        </v-btn>
      </v-col>
    </v-row>
    <span class="d-block mb-5 font-weight-bold">TROOPS COUNT TO TRAIN</span>
    <v-row>
      <v-col v-for="(item, index) in troopsKeys" :key="index" cols="4"
        >{{ troopsResultLabel(item) }} - Total
        <b>{{ troopsResultTotal(item) }}</b>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(troopKey, troopIndex) in troopsKeys"
        :key="troopIndex"
        cols="4"
      >
        <p
          v-for="(item, index) in troopsResultBreakdown(troopKey)"
          :key="index"
        >
          {{ item }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      storage: {
        gist_id: '6cd2857ed99f6d1107859b6de2deafdf',
        filename: 'challenge-quests-points-required.json',
      },
      troopsQuantity: localStorage.getItem('troopsQuantity') ?? '',
      defaultPointsRequired: '',
      customPointsRequired: '',
      selectedOption: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Custom',
          value: 'custom',
        },
      ],
      pointsRequiredDefaultOptions: [],
      troopTierEquivalentPoints: {
        T3: 5,
        T4: 15,
      },
      troopCountsToTrainResult: {
        T3: {
          label: 'Tier 3',
          breakdown: [],
          total: 0,
        },
        T4: {
          label: 'Tier 4',
          breakdown: [],
          total: 0,
        },
      },
    }
  },
  computed: {
    troopsKeys() {
      return Object.keys(this.troopCountsToTrainResult)
    },
  },
  async created() {
    const request = await fetch(
      `https://api.github.com/gists/${this.storage.gist_id}`
    )
    const payload = await request.json()
    const parsedPayload = JSON.parse(
      payload.files[this.storage.filename].content
    )
    const { pointsRequired } = { ...parsedPayload }
    this.pointsRequiredDefaultOptions = pointsRequired
  },
  methods: {
    saveTroopsQuantity() {
      localStorage.setItem('troopsQuantity', this.troopsQuantity)
      const { success } = { ...this.alertDetails }
      this.alert({
        details: success,
        message: 'Troop training quantity updated!',
      })
    },
    clearCustomPointsRequired() {
      this.clearInputs()
    },
    clearInputs() {
      this.defaultPointsRequired = ''
      this.customPointsRequired = ''
      this.troopCountsToTrainResult = {
        T3: {
          label: 'Tier 3',
          breakdown: [],
          total: 0,
        },
        T4: {
          label: 'Tier 4',
          breakdown: [],
          total: 0,
        },
      }
    },
    troopsResultLabel(index) {
      return this.troopCountsToTrainResult[index].label
    },
    troopsResultTotal(index) {
      return this.troopCountsToTrainResult[index].total
    },
    troopsResultBreakdown(index) {
      return this.troopCountsToTrainResult[index].breakdown
    },
    computeTroopsCountToTrain() {
      if (!this.troopsQuantity) {
        this.$nextTick(() => {
          this.clearInputs()
        })
        const { error } = { ...this.alertDetails }
        this.alert({
          details: error,
          message: 'Insert troop quantity first!',
        })
        return
      }

      for (const troopTier of Object.keys(this.troopTierEquivalentPoints)) {
        const sourceOfPointsRequired =
          this.selectedOption === 'default'
            ? this.defaultPointsRequired
            : this.customPointsRequired
        const troopsCountRequired =
          sourceOfPointsRequired / this.troopTierEquivalentPoints[troopTier]
        const divisibleCount = Math.trunc(
          troopsCountRequired / this.troopsQuantity
        )
        const troopsToTrainAmount = []
        const mainTroopsCount =
          divisibleCount === 0
            ? Math.round(troopsCountRequired)
            : `${Number.parseInt(this.troopsQuantity)} x ${divisibleCount}`
        troopsToTrainAmount.push(mainTroopsCount)
        if (this.troopsQuantity < troopsCountRequired) {
          const troopsToTrainRemainder =
            troopsCountRequired % this.troopsQuantity
          troopsToTrainAmount.push(Math.round(troopsToTrainRemainder))
        }
        this.troopCountsToTrainResult[troopTier].breakdown = troopsToTrainAmount
        this.troopCountsToTrainResult[troopTier].total =
          Math.round(troopsCountRequired).toLocaleString()
      }
    },
  },
}
</script>

<style scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
