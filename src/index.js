
import { getPhotos } from "./utils/apiServices";
import { ApiService } from "./utils/apiServices";
import { createGalleryMarkUp } from "./utils/render";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix, { Notify } from 'notiflix';


const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  // loadMoreBtn: document.querySelector('.load-more'),
  intersection: document.querySelector('.intersection-element')

};
let imagesValue = 0;
refs.form.addEventListener('submit', onFormSubmit);
// refs.loadMoreBtn.addEventListener('click', handleLoadMore)
const apiPhotoServise = new ApiService();
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  docClose: false,
  captions: true,
  captionPosition: 'bottom',
});

async function onFormSubmit(event) {
  event.preventDefault();
  const searchQuery = event.currentTarget.elements.searchQuery.value;
  // console.log(searchQuery);
  apiPhotoServise.query = searchQuery;
  apiPhotoServise.page = 1;
  try {
    const [photos, total] = await apiPhotoServise.getPhotos();
  // console.log(photos);
  imagesValue += photos.length;
  apiPhotoServise.hitsTotal = total;
  refs.gallery.innerHTML = createGalleryMarkUp(photos);
  lightbox.refresh();
  createObserver();
  Notify.info(`"Hooray! We found ${total} images."`)
  }
  catch(err) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.")
  }
  
}

async function handleLoadMore() {
  apiPhotoServise.increasePage();
  if (imagesValue >= apiPhotoServise.hitsTotal) {
    Notify.warning("We're sorry, but you've reached the end of search results.")
    return
  }
  const [photos, total] = await apiPhotoServise.getPhotos();
  refs.gallery.insertAdjacentHTML('beforeend', createGalleryMarkUp(photos))
  lightbox.refresh();
  imagesValue += photos.length;
}


function createObserver() {

  let options = {
    root: null,
    rootMargin: "100px",
  };

  const observer = new IntersectionObserver(handleLoadMore, options);
  observer.observe(refs.intersection);
}