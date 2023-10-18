"use strict";
//6. Hiển thị các bài viết
const newsContainer = document.getElementById("news-container");
// const btnPrev = document.getElementById("btn-prev");
// const pageNum = document.getElementById("page-num");
// const btnNext = document.getElementById("btn-next");
const apiKey = "46314a742e1c4c37bee09d6ea1d01a7a";
//biến để tính số news API trả về tối đa
let totalResults = 0;
let pageSize = 2;
let category = "sports";
let currentPage = 1;
let subling = 2; // subling la xung quanh current co bao nhieu phan tu
//Hàm hiển thị list News trên trang
function displayNewList(data) {
  totalResults = data.totalResults;
  let largestPage = Math.ceil(totalResults / pageSize); //so trang lon nhat

  let html = "";
  data.articles.forEach((article) => {
    html += `
    <div class="new-content" >
      <div class="img-banner" >
        <img src=${article.urlToImage ?? "no-image.png"} alt="No image"/>
      </div>
      <div class="content">
        <h4>${article.title}</h4>
        <p>${article.description}</p>
        <button class="btn-view"><a href="${
          article.url
        }" target="blank">View</a></button>
      </div>
    </div> `;
  });

  //hien thi phan trang
  html += displayPagination(currentPage, largestPage, subling);
  newsContainer.innerHTML = html;

  // them su kien cho tung nut nay
  const nextBt = document.querySelector(".pre");
  if (nextBt) {
    nextBt.addEventListener("click", function () {
      // alert("clik next pre");
      currentPage--;
      getDataNews("us", currentPage);
    });
  }

  const preBt = document.querySelector(".next");
  if (preBt) {
    preBt.addEventListener("click", function () {
      // alert("clik next pre");

      currentPage++;
      getDataNews("us", currentPage);
    });
  }

  const noBt = document.querySelectorAll(".p");
  noBt.forEach((el) =>
    el.addEventListener("click", function () {
      currentPage = parseInt(el.textContent);
      getDataNews("us", currentPage);
    })
  );
}

//Hàm lấy data từ API và hiển thị ra list tin tức
async function getDataNews(country, page) {
  try {
    //kết nối api và lấy dữ liệu \\ sao em truyền page vòa rồi k dùng
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`
    );
    const data = await res.json();
    console.log(data);
    displayNewList(data);
  } catch (err) {
    alert("Error:" + err.message);
  }
}
getDataNews("us", 1);

function displayPagination(cur, largest, subling) {
  const arr4Display = [];

  //ben trai xu ly truoc
  // neu current <=1: an Pre
  if (cur > 1) {
    arr4Display.push(`<li class='pre'>Trang Trước</li>`);
  }
  //  else arr4Display.push("Pre");
  // neu current - subling <=2 thi bat dau = 1 khong co ..., di tu 1 den cur
  if (cur - subling <= 2) {
    for (let i = 1; i < cur; i++) arr4Display.push(`<li class='p'>${i}</li>`);
  } else {
    arr4Display.push(`<li class='p'>1</li>`);
    arr4Display.push("...");
    for (let i = cur - subling; i < cur; i++)
      arr4Display.push(`<li class='p'>${i}</li>`);
  }
  arr4Display.push(`<li class='current'>${cur}<li>`);
  //ben phai tuong tu
  if (cur + subling >= largest - 1)
    for (let i = cur + 1; i <= largest; i++)
      arr4Display.push(`<li class='p'>${i}</li>`);
  else {
    for (let i = cur + 1; i <= cur + subling; i++)
      arr4Display.push(`<li class='p'>${i}</li>`);
    arr4Display.push("...");
    arr4Display.push(`<li class='p'>${largest}</li>`);
  }

  if (cur < largest) {
    arr4Display.push(`<li class='next'>Trang Sau</li>`);
  }
  // console.log(arr4Display.join(""));
  //hien thi va them su kien

  return `<ul class='pagination'>${arr4Display.join("")}</ul>`;
}

// test ham
// console.log(displayPagination(1, 10, 2));
// console.log(displayPagination(2, 10, 2));
// console.log(displayPagination(4, 10, 2));
// console.log(displayPagination(10, 10, 2));
