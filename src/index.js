import {EMPTY, fromEvent} from 'rxjs'
import {debounceTime, distinctUntilChanged, map, switchMap, mergeMap, tap, catchError, filter} from 'rxjs/operators'
import {ajax} from  'rxjs/ajax'
const url = 'https://api.github.com/search/users?q=';


let search = document.getElementById('search');
let result = document.getElementById('result')

let stream$ = fromEvent(search, 'input')
.pipe(
    map(e => e.target.value),
    debounceTime(1000),
    distinctUntilChanged(),
    tap(() => result.innerHTML = ''),
    filter(v => v.trim()),
    switchMap( v => ajax.getJSON(url + v).pipe(
      catchError(err => EMPTY)
    )),
    map(response => response.items),
    mergeMap(items => items)
)

stream$.subscribe(user =>{
    const html = `
    <div class="card">
    <div class="card-image">
      <img src="${user.avatar_url}">
      <span class="card-title">${user.login}</span>
      <div class="card-action">
        <a href="${user.html_url}" target="_blank">Open GitHub</a>
      </div>
    </div>
    </div>
    `
    result.insertAdjacentHTML('beforeend', html)
})