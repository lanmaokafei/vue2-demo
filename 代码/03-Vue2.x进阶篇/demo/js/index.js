/**
 * Created by xiaomage on 2017/4/5.
 */
new Vue({
   el: '#app',
   data: {
       // 购物车中所有的商品
       productList: [],
       // 是否全选
       checkedAll: false,
       // 总金额
       totalPrice: 0,

       // 是否显示删除面板
       isShowDelPanel: false,
       
       // 当前要删除的商品
       currentDelProduct: {}
   },

   /**
    * 组件已经加载完毕,实例处于运转的状态 (ready)
    * 请求网络数据
   */
   mounted() {
       // 1. 请求本地的数据
       this.loadCartData();
   },

    /**
     * 局部过滤器
     */
   filters: {
        /**
         * 格式化的价格
         * @param value
         */
       formatMoney(value){
          return '¥' + value.toFixed(2) + '元'
       }
   },

   methods: {
       /**
        * 加载本地的JSON数据
        */
       loadCartData() {
           this.$http.get('data/cart.json').then(response => { // get body data
               // 1.1 获取请求的数据
               const res = response.body;

               // 1.2 判断
               if(res && res.status == '1'){
                   this.productList = res.result.productList;

                   // 3. 计算总金额
                   this.getTotalPrice();
               }

           }, response => {  // error callback
               alert('请求数据失败');
           });
       },

       /**
        * 计算单件商品的总金额
        * @param product
        * @param flag  + -
        */
       singerProductPrice(product, flag){
          if(flag){ // 点击了 +
              product.productQuentity += 1;
          }else {
              // 判断
              if(product.productQuentity <= 1){
                  product.productQuentity = 1;
                  return;
              }
              product.productQuentity -= 1;
          }

           // 3. 计算总金额
           this.getTotalPrice();
       },

       /**
        * 全选和取消全选
        * @param flag
        */
       selectedAll(flag) {
           // 全选和取消全选
           this.checkedAll = flag;

           // 单个商品的选中和取消选中
           this.productList.forEach((value, index)=> {
                if(typeof value.checked === 'undefined'){ // 没有checked属性
                    this.$set(value, 'checked', flag);
                }else { // 有checked属性
                    value.checked = flag;
                }
           });

           // 3. 计算总金额
           this.getTotalPrice();
       },

       /**
        * 单个商品的选中和取消选中
        * @param product
        */
       singerProductSelected(product){
           // 1. 单个商品
           if(typeof product.checked === 'undefined'){ // 没有checked属性
               Vue.set(product, 'checked', true);
           }else { // 有checked属性
               product.checked = !product.checked;
           }

           // 2. 判断是否是全选
           this.isSelectedAll();

           // 3. 计算总金额
           this.getTotalPrice();
       },

       /**
        * 判断是否是全选
        */
       isSelectedAll(){
         let flag = true;
         // 1. 遍历
         this.productList.forEach((value, index) => {
             if(!value.checked){
                  flag = false;
             }
         });

         this.checkedAll = flag;
       },

       /**
        * 计算总价
        */
       getTotalPrice(){
           let totalPrice = 0;
           
           // 遍历所有的商品
           this.productList.forEach((value, index) => {
               if(value.checked){
                   totalPrice += value.productPrice * value.productQuentity
               }
           });
           
           this.totalPrice = totalPrice;
       },

       /**
        * 点击垃圾篓
        */
       clickTrash(product){
          this.isShowDelPanel = true;
          this.currentDelProduct = product; 
       },

       /**
        * 删除商品
        */
       delProduct(){
           this.isShowDelPanel = false;
           // 取出索引
           const  index = this.productList.indexOf(this.currentDelProduct);
           this.productList.splice(index, 1);

           // 3. 计算总金额
           this.getTotalPrice();
       }
   }
});


