new Vue({
    el:'#app',
    data:{
        // 购物车中的数据
        shopListArr: []
    },
    // 组件加载完毕,请求网络数据,业务处理
    mounted(){
        // 请求本地的数据
        this.getLocalData()
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
              .catch(function (error) {
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
        }
    }
});