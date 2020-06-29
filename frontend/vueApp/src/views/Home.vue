<template>
  <div class="mt-6 grid-container flex flex-wrap mx-6">
    <inventory-item
      @addtocart="addToCart(item)"
      @click="openDetail(item)"
      v-for="(item, index) in inventoryItems"
      :key="index"
      :data="item"
    ></inventory-item>
  </div>
</template>

<script>
// @ is an alias to /src
import InventoryItem from "@/components/InventoryItem.vue";
import api from "@/services/api.service";

export default {
  name: "Home",
  components: {
    InventoryItem
  },
  data: () => {
    return {
      inventoryItems: []
    };
  },
  created() {},
  mounted() {
    // console.log("Component mounted", typeof this.items);
    // try {
    //   this.inventoryItems = JSON.parse(this.items);
    //   this.render();
    // } catch (e) {
    //   //swallow
    // }
    api.get({
      url: 'http://localhost:5000/api/inventory'
    }).then((jsonResp) => {
      if (jsonResp) {
        this.inventoryItems = jsonResp;
        this.render();
      }
    });
  },
  methods: {
    render() {
      // console.log("Method render", this.inventoryItems);
    },
    getJSONString(data) {
      // return JSON.stringify(data);
    },
    openDetail(data) {
      // this.$emit("itemclick", { ...data });
      if (window.messageChannel) {
        window.messageChannel.postMessage(JSON.stringify({
          data,
          actionType: 'OPEN_DETAIL'
        }));
      }
    },
    addToCart(data) {
      // this.$emit("addtocart", data);
      if (window.messageChannel) {
        window.messageChannel.postMessage(JSON.stringify({
          data,
          actionType: 'ADD_TO_CART'
        }));
      }
    }
  }
};
</script>
