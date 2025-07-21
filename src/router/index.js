import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '@/views/HomeView.vue'
import PokemonListView from '@/views/PokemonListView.vue'
// De momento no va de momento estara mal configurado
import PokemonDetails from '@/views/PokemonDetailsView.vue'
// Vistas de error
import NotFound from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Pagina inicio con la lista de pokemonss
    {
      path: '/',
      name: 'PokemonListView',
      component: PokemonListView,
      // props para la paginacion de la vista de lista de pokemonss
      props: route => ({ page: parseInt(route.query.page) || 0 })
    },
    // Pagina para informacion concreta de un pokemon
    {
      path: '/pokemon/:name',
      name: 'pokemon-details',
      component: PokemonDetails,
      props: true,
    },
    // Pagina de error al intentar acceder desde cualquier url que no exista
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFound
    },
    // Direccion para el momento de no encontrar la rutas de los recursos de la pagina de NotFound
    {
      path: '/404/NotFound',
      name: '404NotFound',
      component: NotFound,
    },
  ],

  // Aun no finalizo la configuracion de scrollBehavior
  scrollBehavior(to, from, savedPosition) {
    // console.log('Ejecutando scrollBehavior:', { to, from, savedPosition });
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
})

export default router
