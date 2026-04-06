# Automated Git Commit Script
# Runs: git add . -> git commit -m "cloudsheet" -> git push

Write-Host "🔄 Starting automated git commit..." -ForegroundColor Cyan

# Step 1: Git Add
Write-Host "📦 Running: git add ." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: git add failed" -ForegroundColor Red
    exit 1
}

# Step 2: Git Commit
Write-Host "💾 Running: git commit -m 'cloudsheet'" -ForegroundColor Yellow
git commit -m "cloudsheet"
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Warning: git commit failed (possibly nothing to commit)" -ForegroundColor Yellow
}

# Step 3: Git Push
Write-Host "🚀 Running: git push" -ForegroundColor Yellow
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: git push failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git workflow completed successfully!" -ForegroundColor Green
