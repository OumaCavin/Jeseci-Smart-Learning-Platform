#!/usr/bin/env python3
"""
Push existing commits to GitHub
"""

import os
import subprocess
import datetime

def log_message(message):
    """Log message to file"""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open('/workspace/git_push.log', 'a') as f:
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
        
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        log_message(f"Command timed out after {timeout} seconds")
        return False
    except Exception as e:
        log_message(f"Exception: {str(e)}")
        return False

def main():
    log_message("Starting git push process")
    
    os.chdir('/workspace')
    
    # Check current status
    run_command('git status')
    
    # Check log
    run_command('git log --oneline -5')
    
    # Set main branch
    run_command('git branch -M main')
    
    # Push to GitHub with longer timeout
    if run_command('git push -u origin main', timeout=120):
        log_message("Successfully pushed to GitHub!")
    else:
        log_message("Failed to push to GitHub")
    
    log_message("Git push process completed")

if __name__ == "__main__":
    main()