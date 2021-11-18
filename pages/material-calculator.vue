<template>
  <v-container>
    <v-col cols="3">
      <v-row>
        <v-btn @click="clearInputs" class="mb-2">CLEAR</v-btn>
      </v-row>
      <v-row>
        <v-text-field
          v-model="greyMaterialQuantity"
          type="number"
          label="Grey Material Quantity"
          @keyup="computeGreyMaterialNeeded"
        >
        </v-text-field>
      </v-row>
      <v-row>
        <v-select
          v-model="quality"
          :items="options"
          placeholder="Quality"
          @change="computeGreyMaterialNeeded"
        ></v-select>
      </v-row>
      <v-row>
        <span><b>Grey Material Needed - </b> {{ result }}</span>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          text: 'Green',
          value: 4,
        },
        {
          text: 'Blue',
          value: 16,
        },
        {
          text: 'Purple',
          value: 64,
        },
        {
          text: 'Gold',
          value: 256,
        },
      ],
      greyMaterialQuantity: '',
      quality: 0,
      result: 0,
    }
  },
  methods: {
    computeGreyMaterialNeeded() {
      this.result = this.greyMaterialQuantity * this.quality
    },
    clearInputs() {
      this.greyMaterialQuantity = ''
      this.quality = 0
      this.result = 0
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
