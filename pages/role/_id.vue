<style lang="scss">
#role-show {
  .sub-title {
    margin-bottom: 20px;
  }

  .intro {
    margin-bottom: 35px;

    .avatar-wrap {
      float: left;
      margin-right: 25px;
      text-align: center;

      .avatar {
        margin-top: 10px;
        width: 180px;
        height: 180px;
        display: block;
        border-bottom-left-radius: 225px 15px;
        border-bottom-right-radius: 15px 255px;
        border-top-left-radius: 15px 225px;
        border-top-right-radius: 255px 15px;
        box-shadow: 15px 28px 25px -18px rgba(0, 0, 0, 0.2);
        border: 2px solid #41403e;
      }

      button {
        margin-top: 18px;
      }
    }

    .info {
      overflow: hidden;

      .name {
        font-size: 42px;
        margin-bottom: 10px;
        margin-top: 0;
      }

      .summary {
        line-height: 24px;
        font-size: 14px;
        margin-bottom: 10px;

        &.collapsed {
          @include twoline(24px);
        }

        button {
          color: $color-blue-normal;
          font-size: 14px;
        }

        p {
          line-height: 24px;
          font-size: 14px;
        }
      }

      .alias {
        line-height: 24px;
        font-size: 14px;
        margin-bottom: 10px;

        strong {
          float: left;
        }

        li {
          float: left;
          margin-right: 10px;
        }
      }

      .coin {
        line-height: 24px;
        font-size: 14px;
        margin-bottom: 10px;
      }
    }
  }

  .lover {
    margin-bottom: 25px;

    .user {
      .avatar {
        display: inline-block;
        vertical-align: middle;
        border: 1px solid #f0f0f0;
        overflow: hidden;
        @include avatar(40px);
      }
    }
  }

  .newest-owners {
    .user-face {
      margin: 0 -5px;
      display: inline-block;
      vertical-align: middle;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid #fff;
      }

      a {
        display: block;
      }
    }

    .el-icon-more {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: #fff;
      border: 3px solid #fff;
      background-color: $color-gray-normal;
      margin-left: -10px;

      &:hover {
        background-color: $color-gray-deep;
      }
    }
  }

  .rules {
    ul {
      margin-left: 12px;
      margin-top: 5px;

      li {
        list-style-type: disc;
        line-height: 22px;
      }
    }
  }

  .invite-code {
    button {
      width: 100%;
      background-color: #f25d8e;
      border-radius: 4px;
      box-shadow: 0 4px 4px rgba(255, 112, 159, 0.3);
      color: #fff;
      cursor: pointer;
      font-size: 18px;
      line-height: 50px;
      padding: 0 24px;
      margin-bottom: 20px;

      &:hover {
        background-color: #ff709f;
      }
    }

    p {
      font-size: 12px;
      color: $color-text-light;
      margin-bottom: 20px;
    }
  }
}
</style>

<template>
  <div id="role-show">
    <v-header/>
    <v-layout>
      <div class="intro clearfix">
        <p class="sub-title">偶像信息</p>
        <div class="avatar-wrap">
          <img
            :src="$resize(role.avatar, { width: 360 })"
            class="avatar"
          >
          <star-idol-btn
            :id="id"
            :price="role.stock_price"
            :locked="role.is_locked"
            :max="+role.max_stock_count"
            :buyed="+role.star_count"
            :name="role.name"
            @success="handleStarCallback"
          />
          <idol-deal-btn
            :id="id"
            :name="role.name"
            :count="role.has_star"
            :price="role.stock_price"
            :locked="role.is_locked"
            :state="role.company_state"
          />
        </div>
        <div class="info">
          <h1
            class="name"
            v-text="role.name"
          />
          <p
            v-if="collapsed"
            class="summary collapsed"
          >
            <strong>简介：</strong>{{ role.intro.substr(0, 30) }}
            <button @click="collapsed = false">全文</button>
          </p>
          <div
            v-else
            class="summary"
          >
            <strong>简介：</strong>
            <p v-html="computedHtmlIntro"/>
            <button @click="collapsed = true">收起</button>
          </div>
          <strong>股市行情：</strong>
          <idol-stock-chart :idol="role"/>
        </div>
      </div>
      <div
        v-if="role.boss"
        class="lover"
      >
        <p class="sub-title">大股东</p>
        <a
          :href="$alias.user(role.boss.zone)"
          class="user"
          target="_blank"
        >
          <div class="avatar">
            <img :src="$resize(role.boss.avatar, { width: 80 })">
          </div>
          <span v-text="role.boss.nickname"/>
        </a>
        <span>：{{ role.lover_words || 'TA还什么都没说！' }}</span>
      </div>
      <div>
        <p class="sub-title">应援群</p>
        <div class="coin">
          <p><strong>QQ群号：</strong>{{ role.qq_group || '106402736' }}</p>
          <br>
        </div>
      </div>
      <tab-container
        :list="pages"
        :route="false"
        @change="handleTabSwitch"
      >
        <template slot="0">
          <comment-main
            :id="id"
            :master-id="1"
            :show-header="false"
            type="role"
          />
        </template>
        <template slot="1">
          <idol-owner-list
            :id="id"
            :name="role.name"
            :star="role.star_count"
          />
        </template>
        <template slot="2">
          <idol-market-price-draft
            :is-boss="isBoss"
            :idol="role"
          />
        </template>
        <template slot="3">
          <div class="rules">
            <el-alert
              type="info"
              title="目前还没有开放自定义公司章程，以下为功能简介："
            >
              <ul>
                <li>新注册的公司，只要至少有20人参股，就可以自动上市</li>
                <!--
                <li>新注册的公司，若未能在指定时间期限内上市，则会倒闭，所有投资人的将无法获得收益</li>
                -->
                <li>上市之后，占股最多的人将成为最大的股东</li>
                <li>最大的股东并非实时变更，会在一定周期内自动变更为持股最多的人</li>
                <li>最大的股东可以发起「增发提案」来修改股价</li>
                <li>最大的股东可以留下自己的个人寄语，第一个大股东可以创建应援群</li>
                <li>上市后所有的持股人可以在「交易所」进行股权交易，以赚取虚拟币</li>
                <li>在未来，会开发出更多的方式，让公司能够健康发展</li>
              </ul>
            </el-alert>
          </div>
        </template>
        <template slot="4">
          <template v-if="isBoss">
            <el-collapse
              v-model="activeName"
              accordion
            >
              <el-collapse-item name="0">
                <p
                  slot="title"
                  class="title"
                >
                  信息修改
                </p>
                <change-idol-profile :idol="role"/>
              </el-collapse-item>
              <el-collapse-item name="1">
                <p
                  slot="title"
                  class="title"
                >
                  股权变更
                </p>
                <create-price-market-draft :role="role"/>
              </el-collapse-item>
            </el-collapse>
          </template>
          <create-role-form
            v-if="bangumi.is_master"
            :role="role"
            :bangumi-id="bangumi.id"
            @success="cartoonRoleEditSuccess"
          />
        </template>
      </tab-container>
      <template slot="aside">
        <div class="invite-code">
          <h2 class="sub-title">邀请链接</h2>
          <button
            v-clipboard="share_data.link"
            @success="$toast.success('复制成功~快去发送给好友吧')"
          >点击邀请朋友炒股</button>
          <p>使用你分享的链接注册，你们都能获得团子奖励</p>
        </div>
        <div class="bangumi">
          <p class="sub-title">所属番剧</p>
          <bangumi-panel
            :id="bangumi.id"
            :name="bangumi.name"
            :avatar="bangumi.avatar"
            :summary="bangumi.summary"
          />
        </div>
      </template>
    </v-layout>
  </div>
</template>

<script>
import { getCartoonRoleInfo } from '~/api/cartoonRoleApi'
import TabContainer from '~/components/common/TabContainer'
import CommentMain from '~/components/comments/CommentMain'
import CreateRoleForm from '~/components/bangumi/forms/CreateRoleForm'
import IdolDealBtn from '~/components/idol/IdolDealBtn'
import StarIdolBtn from '~/components/idol/StarIdolBtn'
import IdolOwnerList from '~/components/idol/IdolOwnerList'
import IdolMarketPriceDraft from '~/components/idol/IdolMarketPriceDraft'
import CreatePriceMarketDraft from '~/components/idol/CreatePriceMarketDraft'
import ChangeIdolProfile from '~/components/idol/ChangeIdolProfile'
import { Collapse, CollapseItem } from 'element-ui'
import IdolStockChart from '~/components/idol/IdolStockChart'

export default {
  name: 'RoleShow',
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async asyncData({ app, store, params, error }) {
    const { id } = params
    return getCartoonRoleInfo(app, { id })
      .then(data => {
        const { bangumi } = data
        store.commit('social/SET_STATE', {
          type: 'bangumi',
          id: bangumi.id,
          data: {
            follow: bangumi.followed
          }
        })
        return { ...data }
      })
      .catch(error)
  },
  async fetch({ store, params, query }) {
    await store.dispatch('comment/getMainComments', {
      id: params.id,
      type: 'role',
      seeReplyId: query['comment-id']
    })
  },
  head() {
    return {
      title: `${this.role.name} - 偶像`,
      meta: [
        { hid: 'description', name: 'description', content: this.role.intro },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `calibur,偶像,天下漫友是一家,${this.role.alias}`
        }
      ]
    }
  },
  components: {
    CreateRoleForm,
    CommentMain,
    TabContainer,
    IdolDealBtn,
    StarIdolBtn,
    IdolOwnerList,
    IdolMarketPriceDraft,
    CreatePriceMarketDraft,
    ChangeIdolProfile,
    IdolStockChart,
    'el-collapse': Collapse,
    'el-collapse-item': CollapseItem
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      role: null,
      bangumi: null,
      share_data: null,
      collapsed: true,
      activeName: ''
    }
  },
  computed: {
    pages() {
      const result = [
        { label: '留言板' },
        { label: '董事会' },
        { label: '大事记' },
        { label: '公司章程' }
      ]
      if (this.isBoss || this.bangumi.is_master) {
        result.push({
          label: '信息变更'
        })
      }
      return result
    },
    computeRoleAlias() {
      return this.role.alias.split(',')
    },
    computedHtmlIntro() {
      return this.role.intro.replace(/\n/g, '<br>')
    },
    currentUserId() {
      return this.$store.state.login ? this.$store.state.user.id : 0
    },
    isBoss() {
      return this.role.boss ? this.role.boss.id === this.currentUserId : false
    },
    hasLimited() {
      return this.role.max_stock_count !== '0.00'
    },
    hasBuyStock() {
      return this.role.has_star !== '0.00'
    }
  },
  methods: {
    handleStarCallback({ count, amount }) {
      if (!parseFloat(this.role.has_star)) {
        this.role.fans_count++
        if (this.role.fans_count === 20) {
          this.role.company_state = 1
        }
      }
      if (this.role.boss && this.currentUserId === this.role.boss.id) {
        this.role.boss.score += count
      }
      this.role.market_price = parseFloat(
        parseFloat(this.role.market_price) + amount
      ).toFixed(2)
      this.role.has_star = parseFloat(
        parseFloat(this.role.has_star) + count
      ).toFixed(2)
      this.role.star_count = parseFloat(
        parseFloat(this.role.star_count) + count
      ).toFixed(2)
      this.$toast.success(`当前持股：${this.role.has_star}`)
    },
    cartoonRoleEditSuccess() {
      this.$toast.success('编辑成功')
      window.location.reload()
    },
    handleTabSwitch(index) {
      if (index === 1) {
        this.$store.dispatch('flow/initData', {
          func: 'virtualIdolOwners',
          type: 'seenIds',
          sort: 'biggest',
          id: this.id
        })
      }
      if (index === 2) {
        this.$store.dispatch('flow/initData', {
          func: 'getIdolDraftList',
          type: 'page',
          sort: 'new',
          id: this.id
        })
      }
    }
  }
}
</script>
