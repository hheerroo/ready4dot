
     ,-----.,--.                  ,--. ,---.   ,--.,------.  ,------.
    '  .--./|  | ,---. ,--.,--. ,-|  || o   \  |  ||  .-.  \ |  .---'
    |  |    |  || .-. ||  ||  |' .-. |`..'  |  |  ||  |  \  :|  `--, 
    '  '--'\|  |' '-' ''  ''  '\ `-' | .'  /   |  ||  '--'  /|  `---.
     `-----'`--' `---'  `----'  `---'  `--'    `--'`-------' `------'
    ----------------------------------------------------------------- 


Welcome to your Rails project on Cloud9 IDE!

To get started, just do the following:

1. Run the project with the "Run Project" button in the menu bar on top of the IDE.
2. Preview your new app by clicking on the URL that appears in the Run panel below (https://ready4dot-hheerroo-1.c9users.io/).

Happy coding!
The Cloud9 IDE team


## Support & Documentation

Visit http://docs.c9.io for support, or to learn more about using Cloud9 IDE. 
To watch some training videos, visit http://www.youtube.com/user/c9ide

개선 진행
0. timezone 적용필요
1. 
0. dotMap의 지연과 map의 중앙이 변하는 버그확인(modal과 충돌이 있는듯)//완료
1. dot수정을 통해 latlng병화시 address 연동진행//완료
2. 현재위치 로딩시 오래걸리는 시간을 대비해 버튼액션 적용

문제점 몇가지
1. markers // 아이디에 따라 배열정리, 비효율적 dot이 많아지면 비대해지는 배열크기
2. db : address, img / 수정사항다수
3. modal // 맵을 통한 위치수정, 공개비공개 status관리
4. 디자인
5. 권한에 따른 구분을 위해, show와 edit변화 필요
6. 페이지네이션