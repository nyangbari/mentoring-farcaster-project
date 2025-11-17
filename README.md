
**빠른 CLI 요약 (Windows - cmd.exe)**
**협업자 빠른 시작 (Windows - cmd.exe)**

아래는 로컬에서 작업을 시작할 때 정말로 필요한 최소 명령들입니다. 이 순서대로 실행하면 Docker 중심의 개발환경이 준비됩니다.

1) 저장소 복제 및 브랜치

```bat
git clone <REPO_URL>
cd <repo-folder>\backend
git fetch origin
git checkout dev
git pull origin dev
```

2) 환경파일 복사 (필요한 경우)

```bat
copy .env.example .env
notepad .env
```

3) (권장) 이미지 미리 풀기 ? 네트워크 지연 최소화

```bat
docker-compose pull
```

4) 개발용 컨테이너 실행 (빌드 포함)

```bat
docker-compose up --build
```

또는 백그라운드에서 실행하려면:

```bat
docker-compose up -d --build
docker-compose logs -f app
```

5) 앱 확인

- Swagger: http://localhost:3000/api
- pgAdmin: http://localhost:5050 (Compose에 설정된 이메일/비밀번호 사용)

6) DB 직접 조회 (선택)

```bat
docker-compose exec db psql -U postgres -d nestdb -c "SELECT id, user_id, title, createdAt FROM \"review_request\" ORDER BY id DESC LIMIT 10;"
```

7) 코드 변경 적용

- 컨테이너 내에서 개발 모드(`start:dev`)가 동작하면 파일 변경은 자동 반영됩니다.
- 필요 시 서비스만 재빌드/재시작:

```bat
docker-compose up -d --build app
docker-compose restart app
```

8) (옵션) 로컬 pnpm 개발 환경 ? Docker 대신 로컬에서 실행하려면

```bat
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm run start:dev
```

설명(간단)
- 권장 워크플로: Docker 기반으로 `docker-compose up --build` 사용. 로컬 pnpm은 선택적입니다.
- `.env`가 필요하면 반드시 `copy .env.example .env`로 준비하세요.
- pgAdmin 데이터는 컨테이너 볼륨에 저장됩니다(다음 실행부터는 초기화 작업이 반복되지 않습니다).

필요하면 제가 다음도 준비해 드립니다:
- 아주 간단한 로컬 개발용 `pnpm` 명령 스크립트 세트
- 협업용 체크리스트(포트, 권한 문제 등) 한 페이지
- README 상단에 이 요약을 유지하고 상세 가이드는 `CONTRIBUTING.md`로 분리

---

이 문서로 충분한지, 아니면 더 단축된 한 줄 요약(예: 3줄로만 남기기)을 원하시면 알려주세요.
```bat

cd backend
