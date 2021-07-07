
::PUSH CHANGES TO TESTAPP
ECHO ===== PUSH CHANGES TO TESTAPP =====
::Push changes to testapp
cd %rootPath%\testapp
:: commit changes
git commit -am "Updated %1 - %2"
::Push
git push
