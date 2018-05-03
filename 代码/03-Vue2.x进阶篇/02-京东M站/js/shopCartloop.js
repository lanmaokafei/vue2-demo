new Vue({
    el:'#app',
    data:{
        // 购物车中的数据
        shopListArr: [],
        // 是否全选
        isSelectedAll: false,
        //所有商品总价格
        totalPrice: 0
    },
    // 组件加载完毕,请求网络数据,业务处理
    mounted(){
        // 请求本地的数据
        this.getLocalData()
    },

    // 过滤
    filters:{
        //格式化金钱
        moneyFormat(money){
            return '￥' + money.toFixed(2);
        }
    },
    methods:{
        // 1. 请求本地数据
        getLocalData(){

            // 使用axios
            return axios.get('data/cart.json', {
                params: {
                  ID: 12345
                }
              })
              .then((response) => {
                console.log(response.data);
                const res = response.data;
                if(res){
                    this.shopListArr = res.allShops.shopList;
                    console.log(this.shopListArr);
                }
              })
              .catch((error) => {
                console.log(error);
                alert('请求数据失败!');
              });

            // 使用vue-resource
            // this.$http.get('data/cart.json').then(response => {
            //     this.someData = response.body;
            //     console.log(this.someData);
            //     const res = this.someData;
            //     if(res){
            //         this.shopListArr = res.allShops.shopList;
            //         console.log(this.shopListArr);
            //     }
            // },response =>{
            //
            // });
        },

        // 2.单个商品的数量加减
        singerShopPrice(shop, flag){
            if(flag){
                //加
                shop.shopNumber +=1;
            }else{
                if(shop.shopNumber <= 1){
                    shop.shopNumber =1;
                    return;
                }
                shop.shopNumber -= 1;
            };
            // 2.2计算总价
            this.getAllShopPrice();
        },

        // 3.全选控制
        selectedAll(status){
            // 3.1 总控制
            this.isSelectedAll = !status;

            // 3.2 遍历所有商品的数据
            this.shopListArr.forEach((value, index) =>{
                if(typeof value.checked === 'undefined'){
                    this.$set(value, 'checked', !status);
                }else{
                    value.checked = !status;
                }
            });

            // 3.3 计算总价格
            this.getAllShopPrice();
        },

        // 4.计算商品的总价格
        getAllShopPrice(){
            let totalPrice = 0;
            // 4.1遍历所有商品
            this.shopListArr.forEach((value, index)=>{
               // 判断商品是否被选中
               if(value.checked){
                   totalPrice += value.shopPrice * value.shopNumber;
               }
            });
            this.totalPrice = totalPrice;
            // 判断是否全选
            this.hasSelectedAll();
        },

        // 5.单个商品选中和取消
        singerShopSelected(shop){
            // 5.1 判断是否有checked这个属性
            if(typeof shop.checked === 'undefined'){
                    this.$set(shop, 'checked', true);
            }else{
                shop.checked = !shop.checked;
            };
            // 5.2计算总价
            this.getAllShopPrice();
        },

        // 6.判断是否全选
        hasSelectedAll(){
            let flag = true;
            this.shopListArr.forEach((value,index)=>{
                if(!value.checked){
                    flag = false;
                }
            });
            this.isSelectedAll = flag;
        }
    }
});