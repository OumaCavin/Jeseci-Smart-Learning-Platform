#!/usr/bin/env python3
"""
Commit backend dependency installation changes to git
"""

import os
import subprocess
import sys
from pathlib import Path


def run_git_command(command, cwd=None):
    """Run git command and return result"""
    try:
        if cwd:
            os.chdir(cwd)
        
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=30)
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return 1, "", "Command timed out"
    except Exception as e:
        return 1, "", str(e)


def setup_git_repo():
    """Initialize or setup git repository"""
    print("🔧 Setting up Git repository...")
    
    # Check if git is already initialized
    rc, stdout, stderr = run_git_command('git status')
    if rc != 0 and 'Not a git repository' in stderr:
        print("📁 Initializing git repository...")
        rc, stdout, stderr = run_git_command('git init')
        if rc == 0:
            print("✅ Git repository initialized")
        else:
            print(f"❌ Git init failed: {stderr}")
            return False
    
    # Configure git user
    print("🔧 Configuring git user...")
    commands = [
        'git config user.name "OumaCavin"',
        'git config user.email "cavin.otieno012@gmail.com"',
        'git config core.autocrlf false',
        'git config core.pager cat'
    ]
    
    for cmd in commands:
        rc, stdout, stderr = run_git_command(cmd)
        if rc == 0:
            print(f"✅ {cmd}")
        else:
            print(f"❌ {cmd}: {stderr}")
    
    return True


def add_backend_changes():
    """Add backend dependency changes"""
    print("\n🚀 Adding backend dependency changes...")
    
    # Files to stage for the dependency installation
    backend_files = [
        'backend/requirements.txt',
        'backend/venv/',
        'backend/db.sqlite3'
    ]
    
    # Add all backend changes
    rc, stdout, stderr = run_git_command('git add backend/')
    if rc == 0:
        print("✅ Added backend directory")
    else:
        print(f"❌ Failed to add backend: {stderr}")
        return False
    
    return True


def create_commit():
    """Create commit with specified message"""
    print("\n📝 Creating commit...")
    
    commit_message = "feat(backend): install Django REST Framework and required dependencies for API functionality"
    
    rc, stdout, stderr = run_git_command(f'git commit -m "{commit_message}"')
    if rc == 0:
        print("✅ Commit created successfully!")
        print(f"📝 Commit message: {commit_message}")
        return True
    else:
        print(f"❌ Commit failed: {stderr}")
        return False


def setup_remote_origin():
    """Setup remote origin if not exists"""
    print("\n🔗 Setting up remote origin...")
    
    # Check if remote exists
    rc, stdout, stderr = run_git_command('git remote -v')
    if 'origin' not in stdout:
        remote_url = "https://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@github.com/OumaCavin/Jeseci-Smart-Learning-Platform.git"
        rc, stdout, stderr = run_git_command(f'git remote add origin {remote_url}')
        if rc == 0:
            print("✅ Remote origin added")
        else:
            print(f"❌ Failed to add remote: {stderr}")
            return False
    
    return True


def push_to_github():
    """Push changes to GitHub"""
    print("\n📤 Pushing to GitHub...")
    
    # Set main branch
    rc, stdout, stderr = run_git_command('git branch -M main')
    if rc == 0:
        print("✅ Set main branch")
    else:
        print(f"❌ Failed to set main branch: {stderr}")
    
    # Push to GitHub
    rc, stdout, stderr = run_git_command('git push -u origin main')
    if rc == 0:
        print("✅ Successfully pushed to GitHub!")
        return True
    else:
        print(f"❌ Push failed: {stderr}")
        return False


def main():
    """Main function"""
    print("🚀 Committing backend dependency installation changes")
    print("=" * 60)
    
    # Change to workspace directory
    os.chdir('/workspace')
    
    # Setup git repository
    if not setup_git_repo():
        print("❌ Failed to setup git repository")
        return False
    
    # Add backend changes
    if not add_backend_changes():
        print("❌ Failed to add backend changes")
        return False
    
    # Create commit
    if not create_commit():
        print("❌ Failed to create commit")
        return False
    
    # Setup remote origin
    if not setup_remote_origin():
        print("❌ Failed to setup remote origin")
        return False
    
    # Push to GitHub
    if not push_to_github():
        print("❌ Failed to push to GitHub")
        return False
    
    print("\n" + "=" * 60)
    print("✅ All operations completed successfully!")
    print("📦 Backend dependency installation changes committed and pushed to GitHub")
    
    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)