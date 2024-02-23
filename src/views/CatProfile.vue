<template>
  <b-col col="12">
    <!-- Cat profile -->
    <b-col v-if="cat.details" class="d-flex justify-content-center align-items-center">
      <b-card
        no-body
        id="cat-details"
        class="overflow-hidden shadow"
      >
        <b-row no-gutters>
          <b-col md="6" v-if="cat.details.name">
            <b-card-img
              :src="`${cat.details.url}`"
              :alt="`${cat.details.name}`"
              class="rounded-0" 
            >
            </b-card-img>
          </b-col>
          <b-col md="6" v-if="cat.details.name">
            <b-card-body :title="`${cat.details.name}`">
              <b-card-text>
                <strong>Origin:</strong> <em> {{ cat.details.origin  }} </em> <br/><br/>
                <strong>Temperament:</strong> <br/> <em> {{ cat.details.temperament  }} </em> <br/><br/>
                <strong>Description:</strong> <br/> <em> {{ cat.details.description  }} </em>
              </b-card-text>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
    <!-- End cat profile -->
    <!-- No cats to display -->
    <b-col v-else>
      <b-row>
        <b-img
          center
          width="550"
          height="350"
          alt="No cats to display"
          src="https://www.creativefabrica.com/wp-content/uploads/2020/02/11/1581408861/Cat-playing-with-ball-of-yarn-line-art-style-580x386.jpg"
        />
      </b-row>
      <b-row class="d-flex justify-content-center align-items-center text-center text-gray">
        “One cat just leads to another.” <br/>
        – Ernest Hemingway
      </b-row>
    </b-col>
    <!-- End no cats to display -->
  </b-col>
</template>

<script>

import { useRoute } from 'vue-router'
import { useCatsStore } from '@stores/cats'
import { defineComponent, ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue'

export default defineComponent({
  setup() {
    // router variables
    const route = useRoute()

    // store variables
    const catsStore = useCatsStore()

    // cat-related variables
    const cat = ref({
      error: ref(null),
      details: ref({})
    })

    /////////////////////////////////
    // Lifecycle
    ////////////////////////////////

    onMounted(() => {
      catsStore.getCat(route.params.id)
    })

    onBeforeUnmount(() => {
      catsStore.setCatsState({
        error: null,
        details: {}
      })
    })

    /**
     * On unmounted
     */
    onUnmounted(() => {
      unSubscribeCatStore()
    })

    /////////////////////////////////
    // Stores
    ////////////////////////////////

    /**
     * Subscribe to cats store
     * - This is same as watching store state changes
     * 
     * @param {function} mutation
     * @param {object} state
     * 
     * @returns void
     * 
     */
    const unSubscribeCatStore = catsStore.$subscribe((mutation, state) => {
      cat.value = { ...cat.value, ...state.cat }
    })

    return { cat }
  }
})

</script>

<style>

  /* back button */
  #back-to-list {
    width: 100px;
  }

  /* cat details */
  #cat-details {
    max-width: 1000px;

    img {
      min-height: 100%
    }
  }

  /* custom text color */
  .text-gray {
    color: #a3a2a2
  }

</style>
