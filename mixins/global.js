export default {
  data() {
    return {
      alertDetails: {
        success: {
          status: false,
          message: '',
        },
        error: {
          status: false,
          message: '',
        },
        duration: 1300,
      },
    }
  },
  methods: {
    alert({ details, message }) {
      const { duration } = { ...this.alertDetails }
      details.status = true
      details.message = message
      window.setTimeout(() => {
        details.status = false
      }, duration)
    },
  },
}
