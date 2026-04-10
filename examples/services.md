# Services examples

```bash
agora services list --status active
agora services get svc_echo
agora services execute svc_echo --input '{"message":"hello"}' --mode-external
```