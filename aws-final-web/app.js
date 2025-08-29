document.addEventListener('DOMContentLoaded', function() {
  // API URL을 변수로 저장
  const API_BASE_URL = 'https://_________________';

  const boardForm = document.getElementById('boardForm');
  const boardList = document.getElementById('boardList');

  // 게시글 목록을 불러와서 화면에 표시하는 함수
  function loadBoards() {
    fetch(`${API_BASE_URL}/boards`)
      .then(response => {
        if (!response.ok) {
          throw new Error('서버에서 데이터를 불러오지 못했습니다. 상태 코드: ' + response.status);
        }
        return response.json();
      })
      .then(boards => {
        boardList.innerHTML = ''; // 게시글 목록 초기화
        boards.forEach(board => {
          const boardItem = document.createElement('div');
          boardItem.classList.add('board-item');
          boardItem.innerHTML = `
            <h3>${board.title}</h3>
            <p>${board.content}</p>
            <img src="${board.imageUrl}" alt="${board.title}">
          `;
          boardList.appendChild(boardItem);
        });
      })
      .catch(error => {
        console.error('Error:', error);
        alert('게시글을 불러오는 도중 문제가 발생했습니다. 에러 내용: ' + error.message);
      });
  }

  // 게시글 작성 시 폼 데이터를 서버로 보내는 함수
  boardForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('content', document.getElementById('content').value);
    formData.append('image', document.getElementById('image').files[0]);

    fetch(`${API_BASE_URL}/boards`, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('게시글을 작성하는 도중 문제가 발생했습니다. 상태 코드: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        alert('게시글이 성공적으로 작성되었습니다.');
        boardForm.reset(); // 폼 초기화
        loadBoards(); // 게시글 목록 새로고침
      })
      .catch(error => {
        console.error('Error:', error);
        alert('게시글 작성 중 오류가 발생했습니다. 에러 내용: ' + error.message);
      });
  });

  // 페이지가 로드되면 게시글 목록을 불러옴
  loadBoards();
});
