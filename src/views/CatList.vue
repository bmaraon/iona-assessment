<template>
  <b-col col="12" class="flex-grow-1">
    <!-- Cat list -->
    <b-col v-if="cats.options.length">
      <b-card-group columns>
        <b-card
          v-for="cat in cats.options"
          :key="`cat-${breeds.selected}-${cat.id}`"
          :img-src="`${cat.url}`"
          img-top
          class="cards mb-4"
        >
          <b-button
            block
            variant="primary"
            class="justify-content-middle"
            @click="onSelectCat(cat.id)"
          >
          View details
          </b-button>
        </b-card>
      </b-card-group>
      <b-col class="mt-4 border-top">
        <b-row class="mt-4 d-flex justify-content-center align-items-center text-center">
          <b-button
            v-if="cats.loadMore"
            variant="success"
            class="justify-content-middle"
            @click="loadMoreCats()"
          >
            Load More
          </b-button>
          <span v-else class="mb-5 text-gray">
            <em>“Apologies but we could not load new cats for you at this time! Miau!”</em>
          </span>
        </b-row>
      </b-col>
    </b-col>
    <!-- End cat list -->
    <!-- Fetching error -->
    <b-col v-else-if="cats.error">
      <b-row>
        <b-img
          center
          width="500"
          height="500"
          alt="Error"
          src="https://img.freepik.com/premium-vector/sad-sitting-cat-doodle-style-hand-drawn-vector-illustration-isolated-black-outline_654325-366.jpg"
        />
      </b-row>
      <b-row class="d-flex justify-content-center align-items-center text-center text-gray">
        "Purr! Something went wrong. Please try again” <br/>
      </b-row>
    </b-col>
    <!-- End fetching error -->
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

import { useRouter } from 'vue-router'
import { useCatsStore } from '@stores/cats'
import { defineComponent, onUnmounted, ref } from 'vue'

export default defineComponent({
  setup() {
    // router variables
    const router = useRouter()

    // store variables
    const catsStore = useCatsStore()

    // cats-related variables
    const breeds = ref({
      queryParams: ref({}),
      selected: ref(0),
      options: ref([])
    })

    const cats = ref({
      loadMore: ref(true),
      queryParams: ref({}),
      selected: ref(0),
      options: ref([])
    })

    //////////////////////////////////
    // Lifecycle
    /////////////////////////////////

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
      breeds.value = {
        ...breeds.value,
        ...state.breeds
      }
      cats.value = {
        ...cats.value,
        ...state.cats
      }
    })

    /////////////////////////////////
    // Methods
    ////////////////////////////////

    /**
     * On selected cat
     * @returns void
     */
    const onSelectCat = (id) => {
      router.push({
        name: 'cat-profile',
        params: { id: id }
      })
    }

    /**
     * Load more cats
     * @returns void
     */
    const loadMoreCats = () => {
      catsStore.getCats({
        selected: cats.value.selected,
        options: cats.value.options,
        queryParams: {
          ...cats.value.queryParams, ...{
            page: cats.value.queryParams.page + 1
          }
        }
      })
    }

    return {
      breeds,
      cats,
      onSelectCat,
      loadMoreCats
    }
  }
})

</script>

<style>

  #select-breed {
    width: 250px;
  }

  /* Define a custom CSS class for the shadow */
  .cards {
    transition: box-shadow 0.3s; /* Add transition for smooth effect */
  }

  /* Define the shadow effect when the container is hovered */
  .cards:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* Customize the shadow properties as needed */
  }

  /* custom text color */
  .text-gray {
    color: #a3a2a2
  }

</style>
