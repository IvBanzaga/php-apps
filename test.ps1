# --- PowerShell Profile: Git Quick Reference Avanzado ---

# Prompt personalizado (tu versión)
function prompt {
    $currentPath = Get-Location
    $pathParts = $currentPath.Path.Split('\')

    Write-Host "PS " -NoNewline -ForegroundColor Cyan

    for ($i = 0; $i -lt $pathParts.Length; $i++) {
        if ($i -eq 0) {
            Write-Host $pathParts[$i] -NoNewline -ForegroundColor Yellow
        } elseif ($i -eq ($pathParts.Length - 1)) {
            Write-Host "\$($pathParts[$i])" -NoNewline -ForegroundColor Green
        } else {
            Write-Host "\$($pathParts[$i])" -NoNewline -ForegroundColor Magenta
        }
    }

    Write-Host "> " -NoNewline -ForegroundColor White
    return " "
}

# Mensaje de bienvenida
Write-Host " PowerShell 7 Predeterminada" -ForegroundColor Green

# PSReadLine Configuración
Import-Module PSReadLine
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadLineOption -EditMode Windows
Set-PSReadLineKeyHandler -Key Tab -Function MenuComplete

# --- Función de ayuda rápida para Git ---
function githelp {

	param (
        [int]$catNumber = 0
    )

    Write-Host "`n🐙 Git Quick Reference Avanzado`n" -ForegroundColor Cyan

    # Lista de categorías numeradas
    $categories = @(
        "⚙️ Configuración global",
        "📁 Inicialización y clonación",
        "📄 Estado, Staging y Commits",
        "🌿 Ramas / Merge",
        " 🌐 Remotos / Push-Pull",
        "🗃️ Archivos / Refactorización",
        "📦 Stash",
        "🧹 Limpieza",
        "🔑 SSH",
        "🔍 Historial / Revisión"
    )

    $gitCommands = @(
        # Configuración global
        [PSCustomObject]@{Category="⚙️ Configuración global"; Cmd="git config --global user.name [name]"; Desc="Establece el nombre que se anexará a tus commits"}
        [PSCustomObject]@{Category="⚙️ Configuración global"; Cmd="git config --global user.email [email]"; Desc="Establece el email que se anexará a tus commits"}
        [PSCustomObject]@{Category="⚙️ Configuración global"; Cmd="git config --global color.ui auto"; Desc="Habilita la colorización de salida"}

        # Inicialización y clonación
        [PSCustomObject]@{Category="📁 Inicialización y clonación"; Cmd="git init [proyecto]"; Desc="Inicializa un nuevo repositorio local"}
        [PSCustomObject]@{Category="📁 Inicialización y clonación"; Cmd="git clone <url>"; Desc="Clona un repositorio remoto"}
        [PSCustomObject]@{Category="📁 Inicialización y clonación"; Cmd="git remote add origin <url>"; Desc="Añade un repositorio remoto"}
        [PSCustomObject]@{Category="📁 Inicialización y clonación"; Cmd="git remote rename origin <nuevo>"; Desc="Renombra el remoto"}

        # Efectuar cambios
        [PSCustomObject]@{Category="📄 Estado, Staging y Commits"; Cmd="git status"; Desc="Muestra archivos modificados y estado de la rama actual"}
        [PSCustomObject]@{Category="📄 Estado, Staging y Commits"; Cmd="git add <archivo>"; Desc="Agrega un archivo al staging"}
        [PSCustomObject]@{Category="📄 Estado, Staging y Commits"; Cmd="git add ."; Desc="Agrega todos los cambios al staging"}
        [PSCustomObject]@{Category="📄 Estado, Staging y Commits"; Cmd="git commit -m 'mensaje'"; Desc="Realiza un commit con mensaje descriptivo"}
        [PSCustomObject]@{Category="📄 Estado, Staging y Commits"; Cmd="git reset <archivo>"; Desc="Quita un archivo del staging pero mantiene cambios"}
        [PSCustomObject]@{Category="📄 Estado, Staging y Commits"; Cmd="git reset --hard <commit>"; Desc="Desecha todo el historial posterior al commit"}
        [PSCustomObject]@{Category="📄 Estado, Staging y Commits"; Cmd="git diff"; Desc="Muestra diferencias de archivos no comiteados"}
        [PSCustomObject]@{Category="📄 Estado, Staging y Commits"; Cmd="git diff --staged"; Desc="Muestra diferencias entre staging y último commit"}
        [PSCustomObject]@{Category="📄 Estado, Staging y Commits"; Cmd="git revert <commit>"; Desc="Crea un commit que deshace cambios de otro commit"}

        # Branches
        [PSCustomObject]@{Category="🌿 Ramas / Branches"; Cmd="git branch"; Desc="Lista todas las ramas locales"}
        [PSCustomObject]@{Category="🌿 Ramas / Branches"; Cmd="git branch <nombre>"; Desc="Crea una nueva rama"}
        [PSCustomObject]@{Category="🌿 Ramas / Branches"; Cmd="git checkout <rama>"; Desc="Cambia a la rama indicada"}
        [PSCustomObject]@{Category="🌿 Ramas / Branches"; Cmd="git checkout -b <rama>"; Desc="Crea y cambia a una nueva rama"}
        [PSCustomObject]@{Category="🌿 Ramas / Branches"; Cmd="git switch <rama>"; Desc="Alternativa moderna para cambiar de rama"}
        [PSCustomObject]@{Category="🌿 Ramas / Branches"; Cmd="git merge <rama>"; Desc="Fusiona la rama indicada en la actual"}
        [PSCustomObject]@{Category="🌿 Ramas / Branches"; Cmd="git merge --no-ff <rama>"; Desc="Fusiona la rama creando un commit de merge explícito"}
        [PSCustomObject]@{Category="🌿 Ramas / Branches"; Cmd="git rebase <rama>"; Desc="Aplica commits de la rama actual sobre otra"}
        [PSCustomObject]@{Category="🌿 Ramas / Branches"; Cmd="git branch -d <rama>"; Desc="Elimina una rama local"}
        [PSCustomObject]@{Category="🌿 Ramas / Branches"; Cmd="git push origin --delete <rama>"; Desc="Elimina una rama remota"}

        # Stash / Guardar fragmentos
        [PSCustomObject]@{Category="📦 Guardar fragmentos / Stash"; Cmd="git stash"; Desc="Guarda cambios temporales sin commit"}
        [PSCustomObject]@{Category="📦 Guardar fragmentos / Stash"; Cmd="git stash save 'nombre'"; Desc="Guarda cambios con nombre específico"}
        [PSCustomObject]@{Category="📦 Guardar fragmentos / Stash"; Cmd="git stash list"; Desc="Lista todos los stashes guardados"}
        [PSCustomObject]@{Category="📦 Guardar fragmentos / Stash"; Cmd="git stash pop"; Desc="Aplica y elimina el stash más reciente"}
        [PSCustomObject]@{Category="📦 Guardar fragmentos / Stash"; Cmd="git stash apply"; Desc="Aplica cambios guardados sin eliminarlos"}
        [PSCustomObject]@{Category="📦 Guardar fragmentos / Stash"; Cmd="git stash drop"; Desc="Elimina el stash más reciente"}

        # Remotos / Sincronizar cambios
        [PSCustomObject]@{Category="🌐 Remotos / Sincronizar cambios"; Cmd="git fetch"; Desc="Trae cambios remotos sin fusionarlos"}
        [PSCustomObject]@{Category="🌐 Remotos / Sincronizar cambios"; Cmd="git pull"; Desc="Trae y fusiona cambios remotos en la rama actual"}
        [PSCustomObject]@{Category="🌐 Remotos / Sincronizar cambios"; Cmd="git push"; Desc="Envía commits locales al remoto"}
        [PSCustomObject]@{Category="🌐 Remotos / Sincronizar cambios"; Cmd="git push -u origin <rama>"; Desc="Envía la rama y establece upstream para futuros pushes"}

        # Historial
        [PSCustomObject]@{Category="🔍 Historial / Revisión"; Cmd="git log"; Desc="Muestra historial completo de commits"}
        [PSCustomObject]@{Category="🔍 Historial / Revisión"; Cmd="git log --oneline"; Desc="Muestra historial resumido"}
        [PSCustomObject]@{Category="🔍 Historial / Revisión"; Cmd="git log --follow <archivo>"; Desc="Historial de un archivo incluyendo cambios de nombre"}
        [PSCustomObject]@{Category="🔍 Historial / Revisión"; Cmd="git show <commit>"; Desc="Muestra detalles de un commit específico"}
        [PSCustomObject]@{Category="🔍 Historial / Revisión"; Cmd="git reflog"; Desc="Muestra movimientos recientes de HEAD"}
        [PSCustomObject]@{Category="🔍 Historial / Revisión"; Cmd="git diff-tree --no-commit-id --name-only -r <commit>"; Desc="Muestra archivos modificados en un commit específico"}
        [PSCustomObject]@{Category="🔍 Historial / Revisión"; Cmd="git ls-files --other --ignored --exclude-standard"; Desc="Lista archivos ignorados según .gitignore"}
    
        # SSH
        [PSCustomObject]@{Category="🔑 SSH"; Cmd="ssh-keygen -t ed25519 -C 'comentario'"; Desc="Genera un par de claves SSH (pública y privada)"}
        [PSCustomObject]@{Category="🔑 SSH"; Cmd="cat ~/.ssh/id_ed25519.pub"; Desc="Visualiza la clave pública generada"}
        [PSCustomObject]@{Category="🔑 SSH"; Cmd="ssh -T git@github.com"; Desc="Conecta con GitHub usando SSH"}
        [PSCustomObject]@{Category="🔑 SSH"; Cmd="ssh -T git@gitlab.com"; Desc="Conecta con GitLab usando SSH"}

        # Estado y staging
        [PSCustomObject]@{Category="📄 Estado y Staging"; Cmd="git status"; Desc="Muestra archivos modificados y estado de la rama actual"}
        [PSCustomObject]@{Category="📄 Estado y Staging"; Cmd="git add <archivo>"; Desc="Agrega un archivo al staging para el próximo commit"}
        [PSCustomObject]@{Category="📄 Estado y Staging"; Cmd="git add ."; Desc="Agrega todos los cambios al staging"}
        [PSCustomObject]@{Category="📄 Estado y Staging"; Cmd="git reset <archivo>"; Desc="Quita un archivo del staging pero mantiene los cambios"}
        [PSCustomObject]@{Category="📄 Estado y Staging"; Cmd="git reset --hard <commit>"; Desc="Desecha todo el historial posterior al commit especificado"}
        [PSCustomObject]@{Category="📄 Estado y Staging"; Cmd="git commit -m 'mensaje'"; Desc="Realiza un commit con un mensaje descriptivo"}
        [PSCustomObject]@{Category="📄 Estado y Staging"; Cmd="git diff"; Desc="Muestra diferencias de archivos no comiteados"}
        [PSCustomObject]@{Category="📄 Estado y Staging"; Cmd="git diff --staged"; Desc="Muestra diferencias entre staging y último commit"}
        [PSCustomObject]@{Category="📄 Estado y Staging"; Cmd="git revert <commit>"; Desc="Crea un commit que deshace los cambios de un commit anterior"}

        # Ramas y fusiones
        [PSCustomObject]@{Category="🌿 Ramas / Merge"; Cmd="git branch"; Desc="Lista todas las ramas locales"}
        [PSCustomObject]@{Category="🌿 Ramas / Merge"; Cmd="git branch <nombre>"; Desc="Crea una nueva rama"}
        [PSCustomObject]@{Category="🌿 Ramas / Merge"; Cmd="git checkout <rama>"; Desc="Cambia a la rama indicada"}
        [PSCustomObject]@{Category="🌿 Ramas / Merge"; Cmd="git checkout -b <rama>"; Desc="Crea y cambia a una nueva rama en un solo paso"}
        [PSCustomObject]@{Category="🌿 Ramas / Merge"; Cmd="git switch <rama>"; Desc="Alternativa moderna para cambiar de rama"}
        [PSCustomObject]@{Category="🌿 Ramas / Merge"; Cmd="git merge <rama>"; Desc="Fusiona la rama indicada en la rama actual"}
        [PSCustomObject]@{Category="🌿 Ramas / Merge"; Cmd="git merge --no-ff <rama>"; Desc="Fusión visualmente más clara"}
        [PSCustomObject]@{Category="🌿 Ramas / Merge"; Cmd="git merge --squash --no-commit <rama>"; Desc="Fusiona cambios sin hacer commit automáticamente"}
        [PSCustomObject]@{Category="🌿 Ramas / Merge"; Cmd="git rebase <rama>"; Desc="Aplica commits de la rama actual sobre otra rama"}
        [PSCustomObject]@{Category="🌿 Ramas / Merge"; Cmd="git branch -d <rama>"; Desc="Elimina una rama local"}
        [PSCustomObject]@{Category="🌿 Ramas / Merge"; Cmd="git push origin --delete <rama>"; Desc="Elimina una rama remota"}

        # Sincronización remota
        [PSCustomObject]@{Category="🌐 Remotos / Push-Pull"; Cmd="git fetch"; Desc="Trae cambios remotos sin fusionarlos"}
        [PSCustomObject]@{Category="🌐 Remotos / Push-Pull"; Cmd="git pull"; Desc="Trae y fusiona cambios remotos en la rama actual"}
        [PSCustomObject]@{Category="🌐 Remotos / Push-Pull"; Cmd="git push"; Desc="Envía commits locales al remoto"}
        [PSCustomObject]@{Category="🌐 Remotos / Push-Pull"; Cmd="git push -u origin <rama>"; Desc="Envía la rama y establece upstream para futuros pushes"}
        [PSCustomObject]@{Category="🌐 Remotos / Push-Pull"; Cmd="git push --set-upstream origin <rama>"; Desc="Síncrona rama local y remota"}

        # Archivos y refactorización
        [PSCustomObject]@{Category="🗃️ Archivos"; Cmd="git rm <archivo>"; Desc="Elimina un archivo del control de versiones y del disco"}
        [PSCustomObject]@{Category="🗃️ Archivos"; Cmd="git rm --cached <archivo>"; Desc="Elimina un archivo del control de versiones pero lo deja en disco"}
        [PSCustomObject]@{Category="🗃️ Archivos"; Cmd="git mv <archivo> <nuevo_nombre>"; Desc="Renombra un archivo y mantiene el historial"}

        # Guardar fragmentos / Stash
        [PSCustomObject]@{Category="📦 Stash"; Cmd="git stash"; Desc="Guarda cambios temporales sin commit"}
        [PSCustomObject]@{Category="📦 Stash"; Cmd="git stash save 'nombre'"; Desc="Guarda cambios en un stash con nombre específico"}
        [PSCustomObject]@{Category="📦 Stash"; Cmd="git stash push -m 'mensaje' <archivo>"; Desc="Guarda un archivo concreto en el stash"}
        [PSCustomObject]@{Category="📦 Stash"; Cmd="git stash list"; Desc="Lista todos los stashes guardados"}
        [PSCustomObject]@{Category="📦 Stash"; Cmd="git stash pop"; Desc="Aplica y elimina los cambios del stash más reciente"}
        [PSCustomObject]@{Category="📦 Stash"; Cmd="git stash apply"; Desc="Aplica cambios guardados sin eliminarlos del stash"}
        [PSCustomObject]@{Category="📦 Stash"; Cmd="git stash drop"; Desc="Elimina el stash más reciente"}
        [PSCustomObject]@{Category="📦 Stash"; Cmd="git stash clear"; Desc="Elimina todos los stashes"}

         # Limpieza
        [PSCustomObject]@{Category="🧹 Limpieza"; Cmd="git clean -fdxn"; Desc="Muestra archivos no rastreados que serían eliminados"}
        [PSCustomObject]@{Category="🧹 Limpieza"; Cmd="git clean -fd :<archivo>"; Desc="Elimina un archivo no rastreado en particular"}
        [PSCustomObject]@{Category="🧹 Limpieza"; Cmd="git reset HEAD~1"; Desc="Revierte el último commit manteniendo cambios en staging"}
        [PSCustomObject]@{Category="🧹 Limpieza"; Cmd="git checkout ."; Desc="Descarta todos los cambios no confirmados"}
        [PSCustomObject]@{Category="🧹 Limpieza"; Cmd="git reset --hard HEAD"; Desc="Fuerza la reversión a la última confirmación"}
        [PSCustomObject]@{Category="🧹 Limpieza"; Cmd="git checkout <archivo> o <directorio>"; Desc="Revertir cambios de un archivo o directorio específico"}
        [PSCustomObject]@{Category="🧹 Limpieza"; Cmd="git reflog"; Desc="Muestra movimientos recientes de HEAD para recuperación"}

    )
 # Extraer categorías únicas y asignar números
    $categories = $gitCommands | Select-Object -ExpandProperty Category -Unique
    $categories = $categories | Sort-Object

    if ($catNumber -eq 0) {
        # Mostrar solo lista de categorías
        Write-Host "Categorías disponibles:" -ForegroundColor Cyan
        for ($i = 0; $i -lt $categories.Count; $i++) {
            Write-Host ("[{0}] {1}" -f ($i+1), $categories[$i])
        }
        Write-Host "`nPara ver una categoría: gh -catNumber <número>`n" -ForegroundColor White
    }
    else {
        if ($catNumber -le 0 -or $catNumber -gt $categories.Count) {
            Write-Host "Número de categoría inválido." -ForegroundColor Red
            return
        }

        # Mostrar comandos de la categoría seleccionada
        $selectedCategory = $categories[$catNumber - 1]
        Write-Host "`n$selectedCategory`n" -ForegroundColor Cyan

        $gitCommands | Where-Object {$_.Category -eq $selectedCategory} | ForEach-Object {
            Write-Host ("{0,-50} -> {1}" -f $_.Cmd, $_.Desc) -ForegroundColor Yellow
        }
        Write-Host ""
    }
}

# Alias
Set-Alias gh githelp