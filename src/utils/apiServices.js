import axios from 'axios';


const agent = axios.create({
  baseURL: 'https://pixabay.com/api',
  params: {
    key: '30252226-b18deeaa358b5519991542b67',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  },
});

export class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
  }
  async getPhotos() {
    const { data: { hits, totalHits }} = await agent.get(`?q=${this.searchQuery}&page=${this.page}`)
    console.log(totalHits)
    if (!hits.length) {
      throw new Error();
    }
    return [hits, totalHits];
    }
    get query() {
      return this.searchQuery
    }
    set query(newSearchQuery) {
      this.searchQuery = newSearchQuery
    }
    increasePage() {
      this.page += 1;
    }
    get hitsTotal() {
      return this.totalHits
    }
    set hitsTotal(total) {
        this.totalHits = total;
    }
}





// axios.defaults.baseURL = BASE_URL;
// export async function getPhotos(searchQuery, page) {
// //   const {
// //     data: { hits },
// //   } = await axios.get(
// //     `/?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
// //   );
// //   return hits;
// const { data: { hits }} = await agent.get(`?q=${searchQuery}&page=${page}`)
// return hits;
// }
