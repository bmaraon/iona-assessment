// import { ref, computed } from 'vue'
import axios from 'axios'
import _ from 'lodash'
import { defineStore } from 'pinia'

export const useCatsStore = defineStore('cats', {
  state: () => {
    return {
        apiURL: 'https://api.thecatapi.com/v1',
        breadcrumbs: [],
        breeds: {
            previousSelected: 0,
            queryParams: {},
            selected: 0,
            options: []
        },
        cats: {
            error: null,
            loadMore: true,
            queryParams: {},
            selected: 0,
            options: []
        },
        cat: {
            error: null,
            details: {}
        }
    }
  },

  actions: {
    /**
     * Set breeds options
     * 
     * @params {mixed} data
     * @returns void
     */
    setBreedsState(data) {
        this.breeds = {...this.breeds, ...data}
    },
    /**
     * Set cats options
     * 
     * @params {mixed} data
     * @returns void
     */
    setCatsState(data) {
        this.cats = {...this.cats, ...data}
    },
    /**
     * Get all cat breeds
     * 
     * @param {object} options - request options or parameters
     * @returns axios
     */
    getBreeds(options) {
        this.breeds = {
            ...this.breeds,
            ...options
        }

        let queryParams = []

        _.map(options.queryParams, (value, key) => {
            queryParams.push(`${key}=${value}`)
        })

        return axios
            .get(`${this.apiURL}/breeds?${ queryParams.join('&') }`)
            .then((response) => {
                this.breeds.options = _.map(
                    response.data,
                    item => {
                        return {
                            value: item.id,
                            text: item.name
                        }
                    }
                )
            }).catch(err => {
                console.log(err)
            })
    },
    /**
     * Get all cats
     * 
     * @param {object} options - request options or parameters
     * @returns axios
     */
    getCats(options) {
        this.cats = {
            ...this.cats, ...{
                ...options, ...{
                    error: null
                }
            }
        }

        this.cat = {}

        let queryParams = []

        _.map(options.queryParams, (value, key) => {
            queryParams.push(`${key}=${value}`)
        })

        return axios
            .get(`${this.apiURL}/images/search?${ queryParams.join('&') }`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VUE_THE_CAT_API_KEY
                }
            })
            .then((response) => {
                if (this.cats.options) {
                    let newOptions = []
                    let clonedCatOptions = _.cloneDeep(this.cats.options)

                    _.forEach(response.data, data => {
                        let option = _.filter(clonedCatOptions, catOption => {
                            return catOption.id === data.id
                        })

                        // add as new cat in the collection
                        if (!option.length) {
                            newOptions.push(data)
                        }
                    })
                    
                    return this.cats = {
                        ...this.cats, ...{
                            options: _.concat(clonedCatOptions, newOptions),
                            loadMore: newOptions.length ? true : false
                        }
                    }
                }
                this.cats.options = response.data
            }).catch(error => {
                console.log(error)
                this.cats = {
                    ...this.cats, ...{
                        error: error
                    }
                }
            })
    },
    /**
     * Get cat details
     * 
     * @param {string} options 
     * @returns void
     */
    getCat(id) {
        this.cat = {
            ...this.cat, ...{
                error: null,
                details: {}
            }
        }
        
        return axios
            .get(`${this.apiURL}/images/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VUE_THE_CAT_API_KEY
                }
            })
            .then((response) => {
                const cat = response.data
                const details = cat.breeds[0]

                delete(cat.breeds)

                this.cat = {
                    ...this.cat, ...{
                        details: {
                            ...cat, ...details
                        }
                    }
                }
            }).catch(error => {
                console.log(error)
                this.cat = {
                    ...this.cat, ...{
                        error: error,
                    }
                }
            })
    },
  },
})
