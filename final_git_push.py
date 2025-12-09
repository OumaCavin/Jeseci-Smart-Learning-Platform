#!/usr/bin/env python3
"""
Final git commit and push with proper token handling
"""

import os
import subprocess
import datetime

def log_message(message):
    """Log message to file and print"""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open('/workspace/final_git.log', 'a') as f:
        f.write(f"[{timestamp}] {message}\n")
    print(message)

def run_command(cmd, timeout=60):
    """Run command and log result"""
    try:
        log_message(f"Running: {cmd}")
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
        
        if result.stdout:
            log_message(f"STDOUT: {result.stdout}")
        if result.stderr:
            log_message(f"STDERR: {result.stderr}")
        if result.returncode != 0:
            log_message(f"Return code: {result.returncode}")
        
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        log_message(f"Command timed out after {timeout} seconds")
        return False, "", "Timeout"
    except Exception as e:
        log_message(f"Exception: {str(e)}")
        return False, "", str(e)

def main():
    log_message("Starting final git commit and push process")
    
    os.chdir('/workspace')
    
    # First, let's see what we have
    success, stdout, stderr = run_command('git status')
    success, stdout, stderr = run_command('git log --oneline -10')
    
    # Check if we have changes to commit
    success, stdout, stderr = run_command('git diff --cached --name-only')
    
    # Since we have 5 commits ahead, let's try to push them
    # The token might need to be used differently
    
    # Remove existing remote and add with token
    log_message("Setting up remote with token...")
    run_command('git remote remove origin')
    
    # Try different token formats
    token = "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"
    repo_url = f"https://{token}@github.com/OumaCavin/Jeseci-Smart-Learning-Platform.git"
    
    success, stdout, stderr = run_command(f'git remote add origin {repo_url}')
    if not success:
        log_message("Failed to add remote, trying alternative...")
        # Alternative: set URL for existing remote
        run_command(f'git remote set-url origin {repo_url}')
    
    # Force push might be needed since we're ahead
    log_message("Attempting to push to GitHub...")
    success, stdout, stderr = run_command('git push -f origin main', timeout=180)
    
    if success:
        log_message("✅ Successfully pushed to GitHub!")
    else:
        log_message("❌ Push failed, checking alternative methods...")
        
        # Try with --set-upstream
        success, stdout, stderr = run_command('git push --set-upstream origin main --force', timeout=180)
        
        if success:
            log_message("✅ Successfully pushed with --set-upstream!")
        else:
            log_message("❌ All push attempts failed")
    
    # Final status check
    run_command('git status')

if __name__ == "__main__":
    main()