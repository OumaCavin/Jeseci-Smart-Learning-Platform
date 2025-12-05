#!/usr/bin/env python3
"""
Git Operations Script
Handles Git status, add, commit, and push operations
"""
import subprocess
import sys
import os

def run_git_command(command, cwd=None):
    """Run a git command and return the result"""
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            cwd=cwd or os.getcwd()
        )
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        return 1, "", str(e)

def git_status():
    """Get git status"""
    code, stdout, stderr = run_git_command("git status --porcelain")
    if code == 0:
        if stdout.strip():
            print("Files with changes:")
            print(stdout)
        else:
            print("No changes to commit")
    else:
        print(f"Error getting status: {stderr}")
    return code == 0

def git_add():
    """Add all changes"""
    print("Adding all changes...")
    code, stdout, stderr = run_git_command("git add -A")
    if code == 0:
        print("Changes staged successfully")
    else:
        print(f"Error adding changes: {stderr}")
    return code == 0

def git_commit(message):
    """Commit changes with the given message"""
    print(f"Committing changes: {message}")
    code, stdout, stderr = run_git_command(f'git commit -m "{message}"')
    if code == 0:
        print("Changes committed successfully")
        print(stdout)
    else:
        print(f"Error committing: {stderr}")
    return code == 0

def git_push():
    """Push changes to remote"""
    print("Pushing changes to remote...")
    code, stdout, stderr = run_git_command("git push origin main")
    if code == 0:
        print("Changes pushed successfully")
        print(stdout)
    else:
        print(f"Error pushing: {stderr}")
    return code == 0

def main():
    if len(sys.argv) < 2:
        print("Usage: python git_operations.py <command> [args]")
        print("Commands:")
        print("  status - Show git status")
        print("  add - Stage all changes")
        print("  commit <message> - Commit changes")
        print("  push - Push to remote")
        print("  full <message> - Add, commit and push")
        return

    command = sys.argv[1].lower()

    if command == "status":
        git_status()
    elif command == "add":
        git_add()
    elif command == "commit":
        if len(sys.argv) < 3:
            print("Commit message required")
            return
        message = sys.argv[2]
        git_commit(message)
    elif command == "push":
        git_push()
    elif command == "full":
        if len(sys.argv) < 3:
            print("Commit message required")
            return
        message = sys.argv[2]
        if git_add() and git_commit(message):
            git_push()
    else:
        print(f"Unknown command: {command}")

if __name__ == "__main__":
    main()