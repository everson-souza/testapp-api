set rootPath=C:\Users\QAOperator\Documents\GitHub
set testappPath=C:\inetpub\wwwroot

ECHO STARTING
::PUBLISHING TO TAURIA CHANNEL
ECHO PUBLISHING TO TAURIA CHANNEL
cd C:\util
curl.exe --data "Started test run on "%2" browser" "https://weblakes.zebu.io/mail_webhook/post?token="%3

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

::PREPARE RESULTS FOLDER
ECHO ===== PREPARE RESULTS FOLDER =====

:: Delete files in allure-results folder
MD "%TEMP%\$_.dummy"&&ROBOCOPY "%TEMP%\$_.dummy" "%rootPath%\BOEM_Tests\%1\allure-results" /E /XD allure-report /PURGE>NUL 2>&1&RD "%TEMP%\$_.dummy"

:: Copy history folder
ROBOCOPY "%testappPath%\projects\%1\%2\allure-report\history" "%rootPath%\BOEM_Tests\%1\allure-results\history" /mir

:: START TEST RUN
ECHO ===== START TEST RUN =====

:: Go to project folder
cd %rootPath%\BOEM_Tests\%1
:: Run tests
call npm run cy:run --browser %2

:: GENERATE REPORT
ECHO ===== GENERATE REPORT =====
:: Go to results folder
cd allure-results

:: Generate
call allure generate %rootPath%\BOEM_Tests\%1\allure-results --clean -o allure-report

ECHO Copy files to testapp
:: Copy files to testapp


ROBOCOPY "%rootPath%\BOEM_Tests\%1\allure-results\allure-report" "%testappPath%\projects\%1\%2\allure-report" /mir

::PUBLISHING TO TAURIA CHANNEL
ECHO PUBLISHING TO TAURIA CHANNEL
cd C:\util

timeout 300

curl.exe --data "Finished test run on "%2" browser. See http://qab01.weblakes.com/projects/"%1"/"%2"/allure-report/index.html for results" "https://weblakes.zebu.io/mail_webhook/post?token="%3

timeout 20 >nul
exit