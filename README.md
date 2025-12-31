
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
docker-compose exec db psql -U postgres -d nestdb -c "SELECT id, user_id, title, createdAt FROM \"review_request\" OR가설명
- 권장 워크플로: Docker 기반으로 `docker-compose up --build` 사용. 로컬 pnpm은 선택적입니다.
- `.env`가 필요하면 반드시 `copy .env.example .env`로 준비하세요.
- pgAdmin 데이터는 컨테이너 볼륨에 저장됩니다(다음 실행부터는 초기화 작업이 반복되지 않습니다).
