<template>
  <b-container fluid>
    <b-row class="fixed-top shadow bg-white">
      <b-col col="12" class="ml-4 mr-4 mt-3 justify-content-start">
        <b-form-group
          v-if="route.name === 'cat-list'"
          id="fieldset-1"
          label-for="select-breed"
          label-class="font-weight-bold pt-0"
        >
          <b-form-select
            id="select-breed"
            v-model="breeds.selected"
            :options="breeds.options"
            @change="onSelectBreedChange"
          />
        </b-form-group>
        <b-button
          v-else
          id="back-to-list"
          class="justify-content-middle ml-2 mb-3"
          @click="goBack()"
        >
          Back
        </b-button>
      </b-col>
    </b-row>
    
    <b-row class="position-relative content">
      <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view>
    </b-row>
  </b-container>
</template>

<style scoped>

.content {
  top: 100px;
}

</style>

<script>

import { useRoute, useRouter, RouterView } from 'vue-router'
import { useCatsStore } from '@stores/cats'
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import _ from 'lodash'

export default defineComponent({
  components: {
    RouterView
  },
  setup() {
    // router variables
    const route = useRoute()
    const router = useRouter()

    // store variables
    const catsStore = useCatsStore()

    // cat-related variables
    const previousRoute = ref({})
    const breeds = ref({
      selected: ref(0),
      options: ref([{
        value: 0,
        text: 'Breeds of cats'
      }])
    })

    /////////////////////////////////
    // Lifecycle
    ////////////////////////////////

    /**
     * On mounted
     */
    onMounted(async () => {
      // make sure to load first the list of breeds
      // before executing the rest of the processes
      await catsStore.getBreeds({
          selected: 0,
          options: [],
          queryParams: {}
        })

      // check of need to autoload list
      const routeBreedQuery = (!_.isEmpty(route.query) && !_.isNil(route.query.breed))
        ? route.query.breed : null

      if (routeBreedQuery) {
        fetchBreeds(routeBreedQuery)
      }
    })

    /**
     * On unmounted
     */
    onUnmounted(() => {
      beforeEachGuard()
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
     */
    const unSubscribeCatStore = catsStore.$subscribe((mutation, state) => {
      breeds.value.options.push(...state.breeds.options)
    })

    /////////////////////////////////
    // Methods
    ////////////////////////////////

    /**
     * On selected breed change
     */
    const onSelectBreedChange = () => {
      if (breeds.value.selected) {
        return updateRouteQueryParams({
          breed: breeds.value.selected
        })
      }
      
      catsStore.setCatsState({
        selected: 0,
        options: [],
        queryParams: {}
      })
    }

    /**
     * Update route query parameters
     * 
     * @var {string} data
     */
    const updateRouteQueryParams = (data) => {
      router.push({
        name: 'cat-list',
        query: _.isEmpty(data) ? data : {
          ...route.query,
          ...data,
        },
      })
    }

    /**
     * Fetch breeds
     * 
     * @param {string} breedId
     * @returns void
     */
    const fetchBreeds = (breedId) => {
      if (breedId) {
        const selectedBreeds = _.filter(
          breeds.value.options, option => {
            return option.value === breedId
          }
        )

        breeds.value.selected = selectedBreeds.length ?
          selectedBreeds[0].value : 0

        return catsStore.getCats({
          selected: 0,
          options: [],
          queryParams: {
            page: 1,
            limit: 10,
            size: 'small',
            order: 'ASC',
            breed_ids: `${breedId}`
          }
        })
      }

      breeds.value.selected = 0
      catsStore.setCatsState({
        selected: 0,
        options: [],
        queryParams: {}
      })
    }

    /**
     * Go back to previous page or route
     */
    const goBack = () => {
      router.go(-1)
    }


    // Access the beforeEach navigation guard
    const beforeEachGuard = router.beforeEach((to, from, next) => {
      previousRoute.value = from
      next();
    });

    /////////////////////////////////
    // Watchers
    ////////////////////////////////

    // watch route
    watch(route, (to, from) => {
      if (to.path === '/' && previousRoute.value.fullPath !== to.fullPath) {
        const routeToBreed = (!_.isEmpty(to.query) && !_.isNil(to.query.breed))
          ? to.query.breed : null

        // this logic is for route changes only!
        // will not cover the re-loading of the page
        return fetchBreeds(routeToBreed)
      }
    });

    return {
      route,
      goBack,
      breeds,
      onSelectBreedChange,
    }
  }
})

</script>