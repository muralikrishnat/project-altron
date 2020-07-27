<template>
    <div class="mt-6 grid-container flex flex-wrap mx-6">
        <inventory-item @addtocart="addToCart(item)" @click="openDetail(item)" v-for="(item, index) in inventoryItems" :key="index" :data="getJSONString(item)"></inventory-item>
    </div>
</template>
<script>
import "./inventory-item";
export default {
    props: ['myProp', 'items'],
    data: () => {
        return {
            inventoryItems: []
        };
    },
    created() {

    },
    mounted() {
        try {
            this.inventoryItems = JSON.parse(this.items);
            this.render();
        } catch(e) {
            //swallow
        }
    },
    methods: {
        render() {
            console.log("Method render", this.inventoryItems);
        },
        getJSONString(data) {
            return JSON.stringify(data);
        },
        openDetail(data) {
            this.$emit('itemclick', {...data} );
        },
        addToCart(data) {
            this.$emit('addtocart', data);
        }
    },
    watch: {
        items: function() {
            try {
                this.inventoryItems = JSON.parse(this.items);
                this.render();
            } catch(e) {
                //swallow
            }
        }
    }
}

</script>
<style>
@import url("http://localhost:5200/css/all.css");
@import url("http://localhost:5200/css/vendor/tailwind.min.css");
@import url("http://localhost:5200/css/dynamic-strategy.css");

</style>