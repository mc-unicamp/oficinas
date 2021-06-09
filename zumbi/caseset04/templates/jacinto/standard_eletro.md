Cycle 1
=======

Begin (start, presentation_3)
-------------------
  ![Emergency room](theme/background-emergency-room-1.png)

@NURSE: Present the case.

@PATIENT: Details about the patient.

@SYSTEM: What do you want to do?

* -> Generate hypothesis
* -> More information
* Call the supervisor -> Call the supervisor.A

Generate hypothesis (input)
---------------------------

@SYSTEM: What is your main diagnostic hypothesis?

? hypothesis

* Submit hypothesis -> Check hypothesis

More information (information)
------------------------------
  ![Emergency room](theme/background-emergency-room-2.png)

<b>MORE INFORMATION</b> <br> More information about the patient.

@PATIENT Jakob

@SYSTEM: What do you want to do?

* Back to the case -> Cycle 1.Begin

Call the supervisor
-------------------

### A (detailed)
  @SUPERVISOR Harry
    ![Supervisor Harry](theme/supervisor.png)

Supervisor explanation.

* Back to the case -> Cycle 1.Begin

### More Supervisor (expansion)

* template: standard_supervisor


Check hypothesis (detailed_role)
--------------------------------

? contribution to diagnostics
  Let us check out your hypothesis. Highlight in green the key findings, in blue the findings that corroborate your hypothesis; in yellow those that are neutral; and in red the ones speaking against your hypothesis.
  * type: group select
  * states: _, k, +, =, -
  * labels: empty, key, contibutes, indiferent, against

{{symptoms/contribution to diagnostics/
Nurse: @Nurse - {symptom}/=/.
}}

* Submit -> Review hypothesis 

Review hypothesis (input)
-------------------------

@SYSTEM: If you want to review your hypothesis, type below the new hypothesis.

? hypothesis

* Submit -> Cycle 2.Order EKG

Cycle 2
=======

## Order EKG (exam)
@Emergency room

Information related to the EKG.

@EKG
  ![EKG](template/ekg-template.svg)

* Magnify -> Magnify EKG

@SYSTEM: What do you want to do?
* -> Generate hypothesis
* -> More information
* -> Call the supervisor

## Magnify EKG (notice_wide)

![EKG Description](template/ekg-template.svg)

* Return -> Order EKG

## Generate hypothesis (input)

@SYSTEM: What is your main diagnostic hypothesis?

? hypothesis

* Submit hypothesis -> Check hypothesis

## More information (information_exam)

<b>MORE INFORMATION</b>

EKG description/EKG findings

<span style="color:#0d4a71;font-weight:bold">Rhythm:</span><br>
sinus rhythm<br>
<span style="color:#0d4a71;font-weight:bold">P waves:</span><br>
normal<br>
<span style="color:#0d4a71;font-weight:bold">PR interval:</span><br>
normal; PR-segment depression in<br>
DII lead<br>
<span style="color:#0d4a71;font-weight:bold">QRS:</span><br>
narrow<br>
normal QRS axis (0 – 90 degrees)<br>
<span style="color:#0d4a71;font-weight:bold">Segmento ST e ondas T:</span><br>
supra ST in DI, DII, DIII, avF, V2-V6 leads

@EKG

* Analyze EKG -> EKG Analysis

@SYSTEM: What do you want to do?
* Back -> Order EKG

## EKG Analysis (notice_wide)

![EKG Description](template/ekg-template.svg)

* Return -> Order EKG

## Call the supervisor (exam)
  @SUPERVISOR Harry

Supervisor explanation.

* -> EKG Analysis

@EKG

@SYSTEM: What do you want to do?
* Back -> Order EKG

## Check hypothesis (marker_exam)

![EKG Description](template/ekg-template.svg)

* Submit -> Review hypothesis

## Review hypothesis (input)
@SYSTEM: If you want to review your hypothesis, type below the new hypothesis.

? hypothesis

* Submit -> Final.Report

Final
=====

Report (detailed)
-----------------

Congratulations, my young Dr. you could helped your patient providing his diagnosis. Now, Let's review all levels of this case.

@Computer: Select a final report level:

* -> Level 1

Level 1 (detailed)
------------------

Final report.

* Return -> Final.Report  

____ Data _____
* theme: jacinto