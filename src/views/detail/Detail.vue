<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"></detail-nav-bar>
    <scroll class="content" ref="scroll">
      <detail-swiper :topImages="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo"></detail-param-info>
    </scroll>
  </div>
</template>
<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";

import Scroll from "components/common/scroll/Scroll";

import { getDetail, Goods, Shop, GoodsParam } from "network/detail";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailGoodsInfo,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailParamInfo
  },
  data() {
    return {
      iid: "",
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {}
    };
  },
  created() {
    this.iid = this.$route.params.iid;
    getDetail(this.iid)
      .then(res => {
        const data = res.result;
        //1.获取顶部的图片轮播数据
        console.log(data);
        this.topImages = data.itemInfo.topImages;
        //2.获取商品信息
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        );
        //3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo);
        //4.保存商品的详情数据
        this.detailInfo = data.detailInfo;
        //5.获取参数的信息
        this.paramInfo = new GoodsParam(
          data.itemParams.info,
          data.itemParams.rule
        );
      })
      .catch(err => {});
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();
    }
  }
};
</script>
<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
/* .detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
} */
.content {
  height: calc(100% - 44px);
  overflow: hidden;
}
</style>