<template>
    <div class="item-card bg-white shadow rounded hover:shadow-md  transform p-1 relative cursor-pointer" @click="openDetail()">
        <div class="w-full h-full bg-gray-200">
            <div class="img-holder object-cover h-full object-center w-full overflow-hidden">
            <img src="https://via.placeholder.com/700x500" class="max-h-full max-w-full mx-auto" alt="item img">
            </div>
        </div>

        <div class="bg-white absolute bottom-0 w-full left-0 rounded-b p-3 flex justify-between">
            <div>{{data.name}}</div>
            <div>{{data.currencyFormat + '' + data.stockPrice.toFixed(2)}}</div>
        </div>

        <div class="absolute top-0 right-0  mr-4 mt-4">
            <div @click="addToCart($event)" class="bg-blue-600 px-2 cursor-pointer capitalize shadow rounded text-white hover:shadow-md btn-add-cart">Add to cart</div>
        </div>
    </div>
</template>
<script>

export default {
    props: ['data'],
    data: () => {
        return {
            inventoryItems: []
        };
    },
    created() {

    },
    mounted() {
        // console.log("Component mounted", this.data);
        // try {
        //     this.inventoryItems = JSON.parse(this.items);
        //     this.render();
        // } catch(e) {
        //     //swallow
        // }
    },
    methods: {
        render() {
            // console.log("Method render", this.inventoryItems);
        },
        getJSONString(data) {
            return JSON.stringify(data);
        },
        openDetail() {
            this.$emit('click', this.data);
        },
        addToCart(event) {
            event.preventDefault();
            event.stopPropagation();
            this.$emit('addtocart', this.data);
        }
    }
}
</script>
<style>
    .item-card {
        height: 24vw;
    }
</style>