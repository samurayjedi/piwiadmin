@php
$formSetup = json_decode(file_get_contents(resource_path().'/formSetup.json'), true);
$companyTypes = $formSetup['companyTypes'];
$yesNo = $formSetup['yesNo'];
$kindOfDocuments = $formSetup['kindOfDocuments'];
$payrollFrequencies = $formSetup['payrollFrequencies'];
$reportMethods = $formSetup['reportMethods'];
$kindOfPayments = $formSetup['kindOfPayments'];
$pickupMethods = $formSetup['pickupMethods'];
$reportsDeliveryMethod = $formSetup['reportsDeliveryMethod'];
$taxImpoundIntervals = $formSetup['taxImpoundIntervals'];
$salexTaxManagementMethods = $formSetup['salexTaxManagementMethods'];
$salesTaxPaymentMethod = $formSetup['salesTaxPaymentMethod'];

function is_checked($el, $value) {
  if (is_array($value)) {
    return in_array(is_array($el) ? $el[0] : $el, $value);
  }
  return (is_array($el) ? $el[0] : $el) === $value;
}
@endphp
<style>
  .logo {
    float: right;
    position: relative;
    top: -20;
  }
  .container {
    padding-top: 10mm;
  }
  p.the-answer {
    padding: 0;
    margin: 0;
  }
</style>
<img src="{{ $logo }}" class="logo">
<div class="container">
  <h1 class="section-title">Company Setup</h1>
  <div class="question">
    <h3 class="the-question">
      1 - Your company name.
    </h3>
    <p class="the-answer">
      {{ $data['company_name'] }}
    </p>
  </div>
  <div class="question">
    <h3 class="the-question">
      2 - What is your company's federal tax classification?.
    </h3>
    <p class="the-answer">
      {{ view('formsetup.radio', [
        'items' => $companyTypes,
        'value' => $data['company_type'],
      ]) }}
    </p>
  </div>
  @if (is_checked($data['company_type'], $companyTypes[5]))
    <div class="question">
      <h3 class="the-question">
        Specify your company type.
      </h3>
      <p class="the-answer">
        {{ $data['company_type_other'] }}
      </p>
    </div>
  @endif
  <div class="question">
    <h3 class="the-question">
      3 - Specify the type of company you have registered (construction, restaurant, etc).
    </h3>
    <p class="the-answer">
      {{ $data['taxes_company_type'] }}
    </p>
  </div>
  <div class="question">
    <h3 class="the-question">
      4 - What is the activity carried out by your company?.
    </h3>
    <p class="the-answer">
      {{ $data['taxes_company_activity'] }}
    </p>
  </div>
  <h1 class="section-title">Payroll Setup</h1>
  <div class="question">
    <h3 class="the-question">
      1 - Are you interested in the payroll service?.
    </h3>
    <p class="the-answer">
      {{ view('formsetup.radio', [
        'items' => $yesNo,
        'value' => $data['want_payroll'],
      ]) }}
    </p>
  </div>
  @if (is_checked($data['want_payroll'], $yesNo[1]))
    <div class="question">
      <h3 class="the-question">
        2 - What type of payment does your company use?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $kindOfDocuments,
          'value' => $data['kind_of_document'],
        ]) }}
      </p>
    </div>
    <div class="question">
      <h3 class="the-question">
        3 - What is the frequency of your payroll?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.check', [
          'items' => $payrollFrequencies,
          'value' => $data['payroll_frequencies'],
        ]) }}
      </p>
    </div>
    <div class="question">
      <h3 class="the-question">
        4 - Check the reporting methods you prefer?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.check', [
          'items' => $reportMethods,
          'value' => $data['report_methods'],
        ]) }}
      </p>
    </div>
    <div class="question">
      <h3 class="the-question">
        5 - How do you want to pay your employees?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.check', [
          'items' => $kindOfPayments,
          'value' => $data['kind_of_payments'],
        ]) }}
      </p>
    </div>
    <div class="question">
      <h3 class="the-question">
        6 - Date to issue the first check?.
      </h3>
      <p class="the-answer">
        {{ (new DateTime($data['first_check_date']))->format('Y-m-d') }}
      </p>
    </div>
    <div class="question">
      <h3 class="the-question">
        7 - What day of the week do you prefer to process your payroll?.
      </h3>
      <p class="the-answer">
        {{ $data['preferred_day_to_process'] }}
      </p>
    </div>
    <div class="question">
      <h3 class="the-question">
        8 - How do you prefer to pick up your checks?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $pickupMethods,
          'value' => $data['preferred_pickup_method'],
        ]) }}
      </p>
    </div>
    @if (is_checked($data['preferred_pickup_method'], $pickupMethods[2]))
      <div class="question">
        <h3 class="the-question">
          What day of the week do you want to pick up your checks?.
        </h3>
        <p class="the-answer">
          {{ $data['pickup_day'] }}
        </p>
      </div>
    @endif
    <div class="question">
      <h3 class="the-question">
        9 - How do you want to receive your reports?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.check', [
          'items' => $reportsDeliveryMethod,
          'value' => $data['report_delivery_method'],
        ]) }}
      </p>
    </div>
    <div class="question">
      <h3 class="the-question">
        10 - How many employees do you have?.
      </h3>
      <p class="the-answer">
        {{ $data['employees'] }}
      </p>
    </div>
    <div class="question">
      <h3 class="the-question">
        11 - You make additional deductions to your employees?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $yesNo,
          'value' => $data['employees_has_deductions'],
        ]) }}
      </p>
    </div>
    @if (is_checked($data['employees_has_deductions'], $yesNo[1]))
      <div class="question">
        <h3 class="the-question">
          Specify the deductions made.
        </h3>
        <p class="the-answer">
          {{ implode(', ', $data['employess_deductions']) }}
        </p>
      </div>
      <div class="question">
        <h3 class="the-question">
          For tax withholding payment (state unemployment 941), how do you want to make deductions to these payments?.
        </h3>
        <p class="the-answer">
          {{ view('formsetup.radio', [
            'items' => $taxImpoundIntervals,
            'value' => $data['tax_impound_interval'],
          ]) }}
        </p>
      </div>
      <div class="question">
        <h3 class="the-question">
          Day of the week on which payments are made from your account?.
        </h3>
        <p class="the-answer">
          {{ $data['prefer_day_to_be_charged_from_bank'] }}
        </p>
      </div>
    @endif
    <div class="question">
      <h3 class="the-question">
        12 - What is the payment period of your company?.
      </h3>
      <p class="the-answer">
        {{ (new DateTime($data['period_start_date']))->format('Y-m-d') }} <-> {{ (new DateTime($data['period_end_date']))->format('Y-m-d') }}
      </p>
    </div>
    <div class="question">
      <h3 class="the-question">
        13 - Your company has divisions?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $yesNo,
          'value' => $data['has_divisions'],
        ]) }}
      </p>
    </div>
    @if (is_checked($data['has_divisions'], $yesNo[1]))
      <div class="question">
        <h3 class="the-question">
          Specify the divisions that your company has?.
        </h3>
        <p class="the-answer">
          {{ implode(', ', $data['divisions']) }}
        </p>
      </div>
      <div class="question">
        <h3 class="the-question">
          Will employee payments be separated by branch?.
        </h3>
        <p class="the-answer">
          {{ view('formsetup.radio', [
            'items' => $yesNo,
            'value' => $data['payments_separated_by_divisions'],
          ]) }}
        </p>
      </div>
    @endif
    <div class="question">
      <h3 class="the-question">
        14 - Your company has departaments?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $yesNo,
          'value' => $data['has_departaments'],
        ]) }}
      </p>
    </div>
    @if (is_checked($data['has_departaments'], $yesNo[1]))
      <div class="question">
        <h3 class="the-question">
          Specify the departaments that your company has?.
        </h3>
        <p class="the-answer">
          {{ implode(', ', $data['departaments']) }}
        </p>
      </div>
    @endif
    <div class="question">
      <h3 class="the-question">
        15 - What types of positions does your company have (Manager, Corporate Communications Manager, etc.)?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $yesNo,
          'value' => $data['employees_by_charges'],
        ]) }}
      </p>
    </div>
    @if (is_checked($data['employees_by_charges'], $yesNo[1]))
      <div class="question">
        <h3 class="the-question">
          Specify the departaments that your company has?.
        </h3>
        <p class="the-answer">
          {{ implode(', ', $data['employees_charges']) }}
        </p>
      </div>
    @endif
  @endif
  <h1 class="section-title">Previous Payroll</h1>
  <div class="question">
    <h3 class="the-question">
      1 - You've done payroll in the last six months?.
    </h3>
    <p class="the-answer">
      {{ view('formsetup.radio', [
        'items' => $yesNo,
        'value' => $data['payroll_done_last_six_month'],
      ]) }}
    </p>
  </div>
  @if (is_checked($data['payroll_done_last_six_month'], $yesNo[1]))
    <div class="question">
      <h3 class="the-question">
        2 - Specify company name.
      </h3>
      <p class="the-answer">
        {{ $data['last_company_name_used'] }}
      </p>
    </div>
    <div class="question">
      <h3 class="the-question">
        3 - Do you have system access?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $yesNo,
          'value' => $data['system_access'],
        ]) }}
      </p>
    </div>
    @if (is_checked($data['system_access'], $yesNo[1]))
      <div class="question">
        <h3 class="the-question">
          Specify the user/email and password.
        </h3>
        <p class="the-answer">
          {{ $data['system_access_user'] }} <-> {{ $data['system_access_password'] }}
        </p>
      </div>
    @endif
    <div class="question">
      <h3 class="the-question">
        4 - Did you collect the payroll reports?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $yesNo,
          'value' => $data['did_collect_reports'],
        ]) }}
      </p>
    </div>
    <div class="question">
      <h3 class="the-question">
        5 - Are you aware of having a "Unemployment ID" license?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $yesNo,
          'value' => $data['has_unemployment_id_license'],
        ]) }}
      </p>
    </div>
    @if (is_checked($data['has_unemployment_id_license'], $yesNo[1]))
      <div class="question">
        <h3 class="the-question">
          Do you have system access?.
        </h3>
        <p class="the-answer">
          {{ view('formsetup.radio', [
            'items' => $yesNo,
            'value' => $data['has_unemployment_id_access'],
          ]) }}
        </p>
      </div>
      @if (is_checked($data['has_unemployment_id_access'], $yesNo[1]))
        <div class="question">
          <h3 class="the-question">
            Specify the user/email and password.
          </h3>
          <p class="the-answer">
            {{ $data['unemployment_id_user'] }} <-> {{ $data['unemployment_id_password'] }}
          </p>
        </div>
      @endif
    @endif
    <div class="question">
      <h3 class="the-question">
        6 - Are you aware of having a "Withholding ID" license?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $yesNo,
          'value' => $data['has_withholding_id'],
        ]) }}
      </p>
    </div>
    @if (is_checked($data['has_withholding_id'], $yesNo[1]))
      <div class="question">
        <h3 class="the-question">
          Do you have system access?.
        </h3>
        <p class="the-answer">
          {{ view('formsetup.radio', [
            'items' => $yesNo,
            'value' => $data['has_withholding_id_access'],
          ]) }}
        </p>
      </div>
      @if (is_checked($data['has_withholding_id_access'], $yesNo[1]))
        <div class="question">
          <h3 class="the-question">
            Specify the user/email and password.
          </h3>
          <p class="the-answer">
            {{ $data['withholding_id_user'] }} <-> {{ $data['withholding_id_password'] }}
          </p>
        </div>
      @endif
    @endif
    <div class="question">
      <h3 class="the-question">
        7 - Have you had problems with your payroll?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $yesNo,
          'value' => $data['has_had_problems_with_payroll'],
        ]) }}
      </p>
    </div>
    @if (is_checked($data['has_had_problems_with_payroll'], $yesNo[1]))
      <div class="question">
        <h3 class="the-question">
          Please tell us a bit.
        </h3>
        <p class="the-answer">
          {{ $data['problem_with_payroll'] }}
        </p>
      </div>
    @endif
  @endif
  <h1 class="section-title">Sales Tax</h1>
  <div class="question">
    <h3 class="the-question">
      1 - Do you sell products that require the payment of "Sales Tax"?.
    </h3>
    <p class="the-answer">
      {{ view('formsetup.radio', [
        'items' => $yesNo,
        'value' => $data['need_sales_tax'],
      ]) }}
    </p>
  </div>
  @if (is_checked($data['need_sales_tax'], $yesNo[1]))
    <div class="question">
      <h3 class="the-question">
        2 - Do you have an active sales tax license?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $yesNo,
          'value' => $data['has_sales_tax_license'],
        ]) }}
      </p>
    </div>
    @if (is_checked($data['has_sales_tax_license'], $yesNo[1]))
      <div class="question">
        <h3 class="the-question">
          Do you have access to it?.
        </h3>
        <p class="the-answer">
          {{ view('formsetup.radio', [
            'items' => $yesNo,
            'value' => $data['has_sales_tax_license_access'],
          ]) }}
        </p>
      </div>
      @if (is_checked($data['has_sales_tax_license_access'], $yesNo[1]))
        <div class="question">
          <h3 class="the-question">
            Specify the user/email and password.
          </h3>
          <p class="the-answer">
            {{ $data['sales_tax_license_user'] }} <-> {{ $data['salex_tax_license_password'] }}
          </p>
        </div>
      @endif
    @endif
    <div class="question">
      <h3 class="the-question">
        3 - Did you recopile the previous reports?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $yesNo,
          'value' => $data['has_previous_sales_tax_reports'],
        ]) }}
      </p>
    </div>
    <div class="question">
      <h3 class="the-question">
        4 - Is the sales tax payment up to date?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $yesNo,
          'value' => $data['is_salex_tax_up_date'],
        ]) }}
      </p>
    </div>
    @if (is_checked($data['is_salex_tax_up_date'], $yesNo[0]))
      <div class="question">
        <h3 class="the-question">
          What kind of problem do you have?.
        </h3>
        <p class="the-answer">
          {{ $data['sales_tax_problems_description'] }}
        </p>
      </div>
    @endif
    <div class="question">
      <h3 class="the-question">
        5 - How would you prefer us to handle sales tax?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $salexTaxManagementMethods,
          'value' => $data['sales_tax_management_method'],
          'style' => 'display: block;',
        ]) }}
      </p>
    </div>
    @if (is_checked($data['sales_tax_management_method'], $salexTaxManagementMethods[0]))
      <div class="question">
        <h3 class="the-question">
          What day of the month do you want ask to submit the payment?.
        </h3>
        <p class="the-answer">
          {{ $data['sales_tax_day_of_month_to_emit_payment'] }}
        </p>
      </div>
      <div class="question">
        <h3 class="the-question">
          How do you want to pay?.
        </h3>
        <p class="the-answer">
          {{ view('formsetup.radio', [
            'items' => $salesTaxPaymentMethod,
            'value' => $data['salex_tax_payment_method'],
          ]) }}
        </p>
      </div>
    @endif
  @endif
  <h1 class="section-title">Taxes</h1>
  <div class="question">
    <h3 class="the-question">
      1 - Did you pay personal/business taxes last year?.
    </h3>
    <p class="the-answer">
      {{ view('formsetup.radio', [
        'items' => $yesNo,
        'value' => $data['did_taxes_payment_the_last_year'],
      ]) }}
    </p>
  </div>
  @if (is_checked($data['did_taxes_payment_the_last_year'], $yesNo[1]))
    <div class="question">
      <h3 class="the-question">
        2 - Have you had problems with your taxes?.
      </h3>
      <p class="the-answer">
        {{ view('formsetup.radio', [
          'items' => $yesNo,
          'value' => $data['has_taxes_problems'],
        ]) }}
      </p>
    </div>
    @if (is_checked($data['has_taxes_problems'], $yesNo[1]))
      <div class="question">
        <h3 class="the-question">
          Please tell us a bit.
        </h3>
        <p class="the-answer">
          {{ $data['has_taxes_problems_description'] }}
        </p>
      </div>
    @endif
  @endif
  <h1 class="section-title">Additional Information</h1>
  <div class="question">
    <h3 class="the-question">
      Sales rep. notes.
    </h3>
    <p class="the-answer">
      {{ array_key_exists('sales_rep_note', $data) ? $data['sales_rep_note'] : '' }}
    </p>
  </div>
</div>
