# Приложение для отслеживания финансов в путешествиях в группе

## Лабораторная работа №3 «Оркестрация в Kubernetes»

---

### Используемые команды

#### Подключение к кластеру

```bash
yc managed-kubernetes cluster get-credentials --id catug1hpck5c3fmngbgf --external
```

#### Проверка статуса узлов

```bash
kubectl get nodes -o wide
```

#### Применение манифеста mongo

```bash
kubectl apply -f mongo.yaml
```

#### Применение манифеста backend

```bash
kubectl apply -f backend.yaml
```

#### Применение манифеста frontend

```bash
kubectl apply -f frontend.yaml
```

#### Примениение манифеста HPA для backend

```bash
kubectl apply -f backend-hpa.yaml
```

#### Проверка состояния подов

```bash
kubectl get pods
```

#### Проверка состояния сервисов

```bash
kubectl get svc
```

#### Проверка HPA

```bash
kubectl get hpa
```

#### Установка metrics-server

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

#### Проверка готовности metrics-server

```bash
kubectl get apiservice v1beta1.metrics.k8s.io -o yaml | grep "status"
```

#### Проверка HPA после загрузки metrics-server

```bash
kubectl get hpa
```

#### Проверка CPU usage backend pod'а

```bash
kubectl get pods
kubectl top pod <backend-pod-name>
```

#### Редактирование deployment metrics-server (при необходимости)

```bash
kubectl edit deployment metrics-server -n kube-system
```

#### Перезапуск backend deployment (после добавления resources)

```bash
kubectl apply -f backend.yaml
```

```bash
kubectl rollout restart deployment travel-exp-backend
```

#### Проверка HPA после перезапуска backend

```bash
kubectl get hpa
```

#### Проведение нагрузочного тестирования backend через frontend

```bash
wrk -t2 -c5 -d30s -s load.lua http://158.160.44.174.nip.io:30701
```

#### Проверка HPA после нагрузки

```bash
kubectl get hpa
```

#### Проверка количества backend pod'ов после масштабирования

```bash
kubectl get pods
```

#### Удаление ресурсов (opционально)

```bash
kubectl delete -f mongo.yaml
```

```bash
kubectl delete -f backend.yaml
```

```bash
kubectl delete -f frontend.yaml
```

```bash
kubectl delete -f backend-hpa.yaml
```

#### Полная очистка текущего namespace (opционально)

```bash
kubectl delete all --all
```

#### Редеплой сервиса

```bash
    docker buildx build --platform linux/amd64 -t aeroserg/travel-exp-backend:latest --push .
    kubectl rollout restart deployment travel-exp-backend

```

```bash
    kubectl apply -f backend.yaml
    kubectl rollout restart deployment travel-exp-backend
```

#### Все поды бэкенда с метками

```bash
kubectl get pods -l app=travel-exp-backend -w
```

#### Реальное потребление CPU/Memory (kube-prometheus в Grafana)

Dashboard → Kubernetes / Compute Resources / Pod   pod=travel-exp-backend*

#### Сколько реплик хочет HPA

```bash
kubectl get hpa
```

#### Логи одного Pod

```bash
kubectl logs -f deploy/travel-exp-backend
```

kubectl get nodes
kubectl get pods -o wide
kubectl get deploy
kubectl get svc
kubectl get ingress
kubectl get hpa
