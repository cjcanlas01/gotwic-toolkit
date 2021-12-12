<template>
  <v-container>
    <v-btn depressed large class="mb-3" @click="clearResourceCounter">
      CLEAR
    </v-btn>
    <v-simple-table>
      <thead>
        <tr>
          <th class="text-center text-h6" width="50%">RESOURCE</th>
          <th class="text-center text-h6">COUNTER</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in resource" :key="index">
          <td>
            <v-text-field
              class="text-h6"
              v-model="item.counter"
              :label="item.label"
              @keyup="computeResourceCounter(index)"
            ></v-text-field>
          </td>
          <td class="text-center text-h6">
            <span>{{ item.result }}</span>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      resource: {
        grain: {
          label: 'GRAIN',
          counter: '',
          result: 0,
        },
        wood: {
          label: 'WOOD',
          counter: '',
          result: 0,
        },
        stone: {
          label: 'STONE',
          counter: '',
          result: 0,
        },
        iron: {
          label: 'IRON',
          counter: '',
          result: 0,
        },
        gold: {
          label: 'GOLD',
          counter: '',
          result: 0,
        },
      },
    }
  },
  methods: {
    computeResourceCounter(index) {
      const counter = this.resource[index].counter
      const compute = counter.split('-').reduce((store, current) => {
        return store + parseInt(current)
      }, 0)
      if (!Number.isNaN(compute)) {
        this.resource[index].result = compute
      }
    },
    clearResourceCounter() {
      Object.keys(this.resource).forEach((value) => {
        this.resource[value].counter = ''
        this.resource[value].result = 0
      })
    },
  },
}
</script>
