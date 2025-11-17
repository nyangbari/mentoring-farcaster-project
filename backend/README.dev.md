Compose V2 개발용 실행 가이드

요약
- 이 프로젝트는 `docker compose`(Compose V2) 의 `--watch` 기능을 사용해 파일 변경을 컨테이너로 자동 동기화하고 개발 편의성을 높일 수 있습니다.
- 기존 `docker-compose.yml`은 하이픈형 `docker-compose`(v1)에서 사용 중일 수 있으므로 별도의 V2 전용 파일 `docker-compose.watch.yml`을 추가했습니다.

사전 조건
- Docker Desktop 또는 Docker Engine이 설치되어 있고 `docker compose`(공백) 명령을 지원해야 합니다. (Compose V2 2.22.0 이상 권장)

버전 확인
```bat
docker compose version
docker-compose version
```
`docker compose version`이 출력되지 않거나 낮은 버전이면 Docker Desktop 설정에서 Compose V2를 활성화하거나 Docker를 업데이트하세요.

사용 방법
1. 개발용 `watch` 실행 (로그와 파일 동기화 이벤트가 섞여 나옵니다):
```bat
cd backend
docker compose -f docker-compose.watch.yml up --watch
```

2. 백그라운드로 띄우고 로그만 보려면:
```bat
docker compose -f docker-compose.watch.yml up -d --build
docker compose -f docker-compose.watch.yml logs -f app
```

3. 종료/재시작:
```bat
docker compose -f docker-compose.watch.yml down
```

팁
- Windows에서 파일 감지 안정성이 떨어지면 `CHOKIDAR_USEPOLLING=true` 환경변수를 사용합니다(이미 `docker-compose.watch.yml`에 포함).
- `watch` 구성이 동작하려면 이미지에 `stat`, `mkdir`, `rmdir`가 있어야 하고, 컨테이너의 실행 유저가 `target` 경로에 쓸 수 있어야 합니다.

**협업자 빠른 시작 (Windows - cmd.exe 예시)**

다른 개발자가 이 저장소의 최신 커밋을 받아 로컬에서 작업하고자 할 때 따라할 수 있는 단계별 절차입니다.

1) 저장소 복제(처음 한 번만)

```bat
REM 새로 클론할 때
git clone <REPO_URL>
cd <repo-folder>\backend
```

2) 이미 클론한 상태에서 최신 커밋을 가져오기

```bat
cd C:\path\to\repo\backend
git fetch origin
git checkout dev
git pull origin dev
```

3) 환경파일 준비

```bat
REM 필요한 환경변수가 .env.example에 있다면 복사 후 필요시 수정
copy .env.example .env
REM (윈도우 메모장 등으로 .env 내용을 수정)
notepad .env
```

4) 도커와 Compose V2 확인

```bat
docker --version
docker compose version
```

5) 개발 모드(파일 감시 포함)으로 실행 ? 권장: Compose V2 사용

```bat
REM docker compose (공백) 사용. docker-compose.watch.yml 파일이 개발용 구성 포함
cd C:\path\to\repo\backend
docker compose -f docker-compose.watch.yml up --watch
```

6) 또는 감시 없이(일반 개발 / 배경 실행)

```bat
docker compose -f docker-compose.watch.yml up -d --build
docker compose -f docker-compose.watch.yml logs -f app
```

7) pgAdmin을 통해 DB를 확인하고 싶을 때

```bat
REM pgAdmin만 실행
docker compose up -d pgadmin
docker compose logs -f pgadmin
```

pgAdmin 접속 후(브라우저) `Add New Server`로 다음 정보 사용:
- Host: `db` (Compose 네트워크 내부에서 접근할 경우)
- Port: `5432`
- Maintenance DB: `nestdb`
- Username: `postgres`
- Password: `postgres`

8) 로컬에서 직접 실행하려면 (선택)

```bat
REM 로컬 Node로 실행 - 도커가 아닌 경우
cd C:\path\to\repo\backend
npm install
npm run start:dev
```

9) 서비스 중지 및 정리

```bat
docker compose -f docker-compose.watch.yml down
```

참고 및 문제 해결
- `--watch`가 동작하지 않으면 `docker compose`(공백) 명령과 `docker compose version` 을 확인하세요.
- 포트 충돌이나 권한 문제 발생 시 `docker ps`와 `docker compose logs <service>`로 로그를 확인하세요.

위 절차를 README.dev.md에 추가했습니다. 필요하시면 팀 규칙(브랜치 네이밍, PR 템플릿, 코드 스타일 등)도 덧붙여 정리해 드리겠습니다.
