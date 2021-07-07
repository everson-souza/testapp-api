set rootPath=C:\Users\QAOperator\Documents\GitHub

ECHO STARTING
::PULL CHANGES ON CYPRESS PROJECT
ECHO ===== PULL CHANGES ON CYPRESS PROJECT =====

::PREPARE RESULTS FOLDER
ECHO Updating BOEM_Tests
::Go to project folder
cd %rootPath%\BOEM_Tests
::Fetch
git fetch origin
::Pull
git pull

ECHO Updating Testapp
::Go to testapp folder
cd %rootPath%\testapp
::Fetch
git fetch origin
::Pull
git pull

::PREPARE RESULTS FOLDER
ECHO ===== PREPARE RESULTS FOLDER =====

:: Delete files in allure-results folder
MD "%TEMP%\$_.dummy"&&ROBOCOPY "%TEMP%\$_.dummy" "%rootPath%\BOEM_Tests\%1-CY\allure-results" /E /XD allure-report /PURGE>NUL 2>&1&RD "%TEMP%\$_.dummy"

:: Copy history folder
ROBOCOPY "%rootPath%\BOEM_Tests\%1-CY\allure-results\allure-report\history" "%rootPath%\BOEM_Tests\%1-CY\allure-results\history" /mir

:: START TEST RUN
ECHO ===== START TEST RUN =====

:: Go to project folder
cd %rootPath%\BOEM_Tests\%1-CY
:: Run tests
call npm run cy:run --browser %2

:: GENERATE REPORT
ECHO ===== GENERATE REPORT =====
:: Go to results folder
cd allure-results

:: Generate
call allure generate %rootPath%\BOEM_Tests\%1-CY\allure-results --clean -o allure-report

ECHO Copy files to testapp
:: Copy files to testapp
ROBOCOPY "%rootPath%\BOEM_Tests\%1-CY\allure-results\allure-report" "%rootPath%\testapp\public\projects\%1\%2\allure-report" /mir 

::PUSH CHANGES TO TESTAPP
ECHO ===== PUSH CHANGES TO TESTAPP =====
::Push changes to testapp
cd %rootPath%\testapp
:: commit changes
git commit -m "Updated %1 - %2"
::Push
git push

timeout 2 >nul
exit