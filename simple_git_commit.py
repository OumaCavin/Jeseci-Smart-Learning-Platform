#!/usr/bin/env python3
"""
Simple git commit script with file logging
"""

import os
import subprocess
import datetime

def log_message(message):
    """Log message to file"""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open('/workspace/git_commit.log', 'a') as f:
        f.write(f"[{timestamp}] {message}\n")
    print(message)

def run_command(cmd):
    """Run command and log result"""
    try:
        log_message(f"Running: {cmd}")
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        
        if result.stdout:
            log_message(f"STDOUT: {result.stdout}")
        if result.stderr:
            log_message(f"STDERR: {result.stderr}")
        if result.returncode != 0:
            log_message(f"Return code: {result.returncode}")
        
        return result.returncode == 0
    except Exception as e:
        log_message(f"Exception: {str(e)}")
        return False

def main():
    log_message("Starting git commit process")
    
    # Initialize git
    os.chdir('/workspace')
    
    if not run_command('git init'):
        log_message("Git init failed, trying to continue...")
    
    # Configure git
    run_command('git config user.name "OumaCavin"')
    run_command('git config user.email "cavin.otieno012@gmail.com"')
    
    # Add files
    if run_command('git add backend/'):
        log_message("Successfully added backend files")
    else:
        log_message("Failed to add backend files")
    
    # Check status
    run_command('git status')
    
    # Commit
    if run_command('git commit -m "feat(backend): install Django REST Framework and required dependencies for API functionality"'):
        log_message("Successfully committed changes")
    else:
        log_message("Failed to commit changes")
    
    # Setup remote
    run_command('git remote add origin https://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@github.com/OumaCavin/Jeseci-Smart-Learning-Platform.git')
    run_command('git branch -M main')
    
    # Push
    if run_command('git push -u origin main'):
        log_message("Successfully pushed to GitHub")
    else:
        log_message("Failed to push to GitHub")
    
    log_message("Git commit process completed")

if __name__ == "__main__":
    main()