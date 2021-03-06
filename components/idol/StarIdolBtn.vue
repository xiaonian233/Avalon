<style lang="scss" module>
.wrap {
  display: inline-block;
}

.cartoon-role-btn {
  width: 80px;
  height: 32px;
  font-size: 14px;
  line-height: 30px;
  text-align: center;
  background-color: #f25d8e;
  border-radius: 4px;
  box-shadow: 0 4px 4px rgba(255, 112, 159, 0.3);
  color: #fff;

  &.locked {
    background-color: $color-dark-light;
    box-shadow: 0 4px 4px rgba($color-dark-light, 0.3);

    &:hover {
      background-color: $color-gray-deep;
    }
  }

  &:hover {
    background-color: #ff709f;
  }
}
</style>

<template>
  <span :class="$style.wrap">
    <button
      :class="[$style.cartoonRoleBtn, { [$style.locked]: locked }]"
      @click="handleStarRole"
    >{{ locked ? '已停牌' : '入股' }}</button>
    <v-dialog
      v-model="showDialog"
      :title="`入股 - ${name}`"
      :loading="submitting"
      width="560px"
      @submit="submit"
    >
      <el-form label-position="top">
        <el-form-item label="当前股价">
          <el-input
            v-model="price"
            :disabled="true"
          >
            <template slot="append">虚拟币每股</template>
          </el-input>
        </el-form-item>
        <el-form-item label="购入上限">
          <el-input
            :disabled="true"
            :placeholder="maxCanBuy"
          />
        </el-form-item>
        <el-form-item label="购入份额">
          <el-input-number
            v-model="count"
            :min="maxCount < 1 ? 0.01 : 1"
            :step="0.01"
            :max="maxCount"
          />
        </el-form-item>
        <el-form-item label="账单计算">
          <div class="pocket">
            <strong>预计支付：</strong><span>{{ needPay }}</span>&nbsp;&nbsp;
            <strong>购买后钱包余额：</strong><span>{{ parseFloat(pocket - needPay).toFixed(2) }}</span>
          </div>
        </el-form-item>
      </el-form>
    </v-dialog>
  </span>
</template>

<script>
import { starRoleAction } from '~/api/cartoonRoleApi'

export default {
  name: 'CartoonRoleBtn',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    price: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    buyed: {
      type: Number,
      required: true
    },
    locked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDialog: false,
      submitting: false,
      count: 1
    }
  },
  computed: {
    pocket() {
      if (!this.$store.state.login) {
        return 0
      }
      return +this.$store.state.user.pocket
    },
    maxCanBuy() {
      if (!this.max) {
        return '无上限'
      }
      return parseFloat(this.max - this.buyed).toFixed(2)
    },
    maxCount() {
      const result = parseFloat(this.price) * this.pocket
      if (!this.max) {
        return parseFloat(result).toFixed(2)
      }
      const last = this.max - this.buyed
      if (last < result) {
        return parseFloat(last).toFixed(2)
      }
      return parseFloat(result).toFixed(2)
    },
    needPay() {
      if (!this.count) {
        return 0
      }
      return (parseFloat(this.price) * this.count).toFixed(2)
    }
  },
  methods: {
    async handleStarRole() {
      if (this.locked) {
        this.$toast.error('已经停牌了，等待下次挂牌吧')
        return
      }
      if (!this.$store.state.login) {
        this.$channel.$emit('sign-in')
        return
      }
      if (!this.pocket) {
        this.$toast.error('团子不足')
        return
      }
      this.showDialog = true
    },
    async submit() {
      if (!this.needPay) {
        this.$toast.error('未选择份额')
        return
      }
      if (this.submitting) {
        return
      }
      this.submitting = true
      try {
        await starRoleAction(this, {
          id: this.id,
          amount: this.count
        })
        this.$store.commit('USE_COIN', this.needPay)
        this.$emit('success', {
          count: this.count,
          amount: this.needPay
        })
        this.showDialog = false
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
