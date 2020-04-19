<template>
  <div id="home">
    <nav-bar class="home-nav">
      <template v-slot:center>
        <div>购物街</div>
      </template>
    </nav-bar>
    <tab-control
      :title="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl2"
      v-show="isTabFixed"
    ></tab-control>
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
      @scroll="contentScroll"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <home-recommend-view :recommends="recommends"></home-recommend-view>
      <home-feature-view></home-feature-view>
      <tab-control :title="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
// 当前组件的子组件
import HomeSwiper from "./childComps/HomeSwiper";
import HomeRecommendView from "./childComps/HomeRecommendView";
import HomeFeatureView from "./childComps/HomeFeatureView";

//公共组件（common或者content）
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabController/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backtop/BackTop";

//network的网络封装
import { getHomeMultidata, getHomeGoods } from "network/home";

import { debounce } from "common/utils";
export default {
  name: "Home",
  components: {
    HomeSwiper,
    HomeRecommendView,
    HomeFeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  created() {
    this.getHomeMultidata();
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  activated() {
    console.log(this.saveY)
    this.$refs.scroll.refresh();
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY();
    console.log(this.saveY)
  },
  mounted() {
    /**
     * 图片加载完成后的监听
     * 由于图片是异步加载，scroll在计算高度时图片还为加载完成,
     * 所有需要在图片加载完成后重新计算高度
     */
    const refresh = debounce(this.$refs.scroll.refresh, 50);
    this.$bus.$on("itemImageLoaded", () => {
      refresh();
    });
  },
  methods: {
    /**
     * 业务相关方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    //触发回滚事件
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    destroyed() {
      console.log("被销毁了");
    },
    //到达某一位置时显示可回滚箭头
    contentScroll(position) {
      //1判断回滚箭头是否显示
      this.isShowBackTop = -position.y > 1000;
      //2决定tabControl是否吸顶
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    loadMore() {
      this.getHomeGoods(this.currentType);
    },
    swiperImageLoad() {
      //由于图片异步加载原因，所以必须等到轮播图加载完成后进行获取偏移量
      //同时必须通过该组件的原生最外层div，即$el
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
      console.log(this.tabOffsetTop);
    },
    /**
     * 网络相关请求方法
     */
    getHomeMultidata() {
      getHomeMultidata()
        .then(result => {
          this.banners = result.data.banner.list;
          this.recommends = result.data.recommend.list;
        })
        .catch(err => {});
    },
    getHomeGoods(type) {
      getHomeGoods(type, this.goods[type].page + 1)
        .then(result => {
          this.goods[type].list.push(...result.data.list);
          this.goods[type].page++;
          // this.$refs.scroll.finishPullUp();
        })
        .catch(err => {});
      this.$refs.scroll && this.$refs.scroll.finishPullUp();
    }
  }
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}
.tab-control {
  position: relative;
  z-index: 9;
}
.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>
