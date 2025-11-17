
**빠른 CLI 요약 (Windows - cmd.exe)**

아래는 가장 자주 사용하는 명령어 모음입니다. 복사해서 바로 실행하세요.

```bat
REM 1) 저장소 복제
git clone <REPO_URL>

REM 2) 최신 커밋 가져오기 (dev 브랜치 기준)
cd C:\path\to\repo\backend
git fetch origin
git checkout dev
git pull origin dev

REM 3) .env 준비
copy .env.example .env
notepad .env

REM 4) Docker 개발(빌드 + 포어그라운드)
cd backend
docker-compose up --build



ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ??



REM non) pnpm세팅할때 진행한 cli명령어 가이드
(관리자 cmd에서 실행)
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
cd backend
pnpm run start:dev

**협업자 상세가이드 시작 (Windows - cmd.exe 예시)**

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
***프로젝트: Docker 중심 개발 가이드 (docker-compose.yml 사용)***

이 문서는 이 저장소를 Docker 기반 개발 흐름으로 사용하기 위한 가이드입니다. `docker-compose.watch.yml`은 더 이상 사용하지 않으며, 개발/디버그는 `docker-compose.yml`을 기준으로 진행합니다.

대상: Windows `cmd.exe` 환경을 기준으로 작성했습니다. (Linux/macOS에서도 명령은 유사합니다.)

목차
- 빠른 요약
- 사전 요구사항
- 환경파일(.env) 준비
- 개발용 컨테이너 실행 (docker-compose)
- 로그/컨테이너 내부 명령
- Swagger/API 테스트
- DB 확인 (pgAdmin 및 psql)
- 변경 적용(코드 수정 반영)
- 패키지 매니저(pnpm) 관련 주의
- CI 간단 메모

빠른 요약
- 개발은 Docker + `docker-compose.yml` 중심으로 진행하세요.
- `backend` 서비스가 NestJS 앱을 제공하며, `db`는 PostgreSQL, `pgadmin`은 DB UI입니다.

1) 사전 요구사항

- Docker Desktop 또는 Docker Engine 설치
- Docker Compose(도구에 따라 `docker-compose` 또는 `docker compose`)가 사용 가능해야 합니다. 이 저장소는 `docker-compose.yml`을 사용하므로 `docker-compose` 명령을 안내합니다.
- pnpm을 로컬에서 사용하려면 Corepack 활성화 권장하지만, Docker 이미지 빌드 시 pnpm이 자동으로 준비되도록 `Dockerfile`이 구성되어 있습니다.

2) 환경파일(.env) 준비

프로젝트의 `backend` 폴더에 `.env.example`이 있다면 복사하여 `.env`로 만드세요.

```bat
cd backend
copy .env.example .env
notepad .env
```

환경변수(예): `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `JWT_SECRET`, `JWT_EXPIRES`

3) 개발용 컨테이너 실행

개발(빌드 포함) 및 로그 확인:

```bat
cd backend
docker-compose up --build
```

백그라운드 실행(데몬):

```bat
docker-compose up -d --build
docker-compose logs -f app
```

특정 서비스만 재시작/실행:

```bat
docker-compose up -d app
docker-compose up -d pgadmin
```

4) 컨테이너 상태 및 내부 접근

컨테이너 목록 확인:

```bat
docker ps
```

앱 컨테이너 쉘 접근 (alpine 기반이므로 `sh` 사용):

```bat
docker-compose exec app sh
```

앱 프로세스 재시작(컨테이너 레벨):

```bat
docker-compose restart app
```

5) Swagger/API 테스트

앱이 실행 중이면 Swagger가 기본 경로에 올라옵니다:

http://localhost:3000/api

Swagger UI에서 `Try it out`을 사용해 `POST /auth/register` 또는 `POST /api/review-request` 등을 호출하면 실제로 `db`에 저장됩니다(앱이 정상적으로 DB에 연결된 경우).

6) DB 확인 ? pgAdmin

pgAdmin 컨테이너 실행 및 접속:

```bat
docker-compose up -d pgadmin
docker-compose logs -f pgadmin
```

브라우저에서 `http://localhost:5050` 접속 → 로그인(Compose 파일에서 설정한 이메일/비밀번호 사용) → `Add New Server`로 PostgreSQL 서버 추가:
- Host: `db`
- Port: `5432`
- Maintenance DB: `nestdb`
- Username: `postgres`
- Password: `postgres`

또는 `psql`로 직접 조회:

```bat
docker-compose exec db psql -U postgres -d nestdb -c "SELECT id, user_id, title, createdAt FROM \"review_request\" ORDER BY id DESC LIMIT 10;"
```

7) 코드 변경 반영(개발 워크플로)

- 개발 중 코드 변경을 반영하려면 `docker-compose up --build`로 재빌드하거나, 개발 모드로 앱이 컨테이너 내에서 `npm run start:dev`(또는 `pnpm run start:dev`)로 실행되도록 구성되어 있으면 해당 프로세스가 파일 변경을 감지해 핫 리로드합니다.
- 컨테이너에서 파일 감지가 불안정하면 로컬에서 코드 편집 후 `docker-compose restart app`을 해주세요.

8) pnpm 관련 주의사항

- 로컬에서 `pnpm`을 사용하려면 Corepack으로 활성화하거나 전역 설치하세요:

```bat
corepack enable
corepack prepare pnpm@latest --activate
pnpm -v
```

- `Dockerfile`은 pnpm을 사용하도록 업데이트되어 있어, Docker 빌드 시 pnpm을 자동 활성화/설치합니다. 로컬에서 `pnpm install`을 먼저 하지 않아도 컨테이너 빌드는 동작합니다.

9) CI 간단 메모

- CI 스크립트(예: GitHub Actions)에서는 빌드 전에 pnpm 활성화:

```yaml
- run: corepack enable && corepack prepare pnpm@latest --activate
- run: pnpm install --frozen-lockfile
```

10) 문제 해결 체크리스트

- `docker-compose up` 시 포트 충돌: `docker ps`로 확인 후 충돌 포트를 변경
- pgAdmin이 계속 재시작하면 환경변수(특히 이메일) 형식이 올바른지 확인
- 앱 로그(오류): `docker-compose logs app` 또는 `docker-compose logs -f app`

문의 및 다음 작업 제안
- 이 가이드를 바탕으로 `pnpm-workspace.yaml`과 루트 `package.json`의 `workspaces` 샘플을 생성해 드릴까요?
- GitHub Actions 템플릿(CI)을 자동 생성해 드릴까요?

---

이제 `docker-compose.yml` 기반으로 개발을 진행하도록 README를 재작성했습니다. 추가로 루트 워크스페이스 설정이나 CI 템플릿을 원하시면 알려주세요.

