@php
    $path = 'images/business_logo/logo.png';
    $mimeType = Storage::disk('public')->mimeType($path);
    $base64Image = base64_encode(Storage::disk('public')->get($path));
    $total = round($sale['total_amount'] * $dolar, 2);
    $toPay = round(($sale['total_amount'] * $dolar) - ($sale['amount_paid'] * $dolar), 2);
    $payed = round($sale['amount_paid'] * $dolar, 2);

    $getMeasurementSuffix = function (string $measurement, int $stock) {
      switch ($measurement) {
        case 'unit':
          return "x$stock";
        case 'liter':
          return $stock > 1 ? "$stock Lts" : "$stock Lt";
        case 'weight':
          return "$stock Kg";
      }

      throw new \Exception("Unknown metric $measurement.");
    };
@endphp
<style>
  div.container {
    font-size: 12px;
    text-align: center;
  }
  h2.title {
    margin: 4px;
  }
  p.shop-name {
    font-size: 18px;
    margin: 0;
  }
  img.logo {
    width: 80px;
    margin-bottom: 4px;
  }
  table {
    width: 270px;
    margin-top: 10px;
    margin-left: -30px;
    margin-bottom: 10px;
    border-spacing: 0;
  }
  table td {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: gray;
  }
</style>
<div class="container">
    <strong>{{ __('Date') }}:</strong>
    {{ date('d/m/Y H:i:s') }}
    <br />
    <strong>{{ __('ID') }}:</strong>
    #{{ $sale['id'] }} {{ $sale['status'] === 'canceled' ? __('(VOIDED)') : '' }}
    <h2 class="title">{{ __('Sale Invoice') }}</h2>
    <p class="shop-name">{{ $business_name }}</p>
    <strong>{{ __('Phone') }}:</strong>
    0414-0000000
    <br />
    <br />
    <img class="logo" src="data:{{$mimeType}};base64,{{$base64Image}}">
    <br />
    <strong>{{ __('Attends') }}:</strong>
    {{ $sale['user']['name'] }}
    <br />
    <strong>{{ __('Client') }}:</strong>
    {{ $sale['client']['name'] }}
    <table>
        <tr>
            <td><strong>{{ __('Products') }}</strong></td>
            <td><strong>{{ __('Price') }}</strong></td>
            <td><strong>{{ __('Quantity') }}</strong></td>
            <td><strong>{{ __('Subtotal' ) }}</strong></td>
        </tr>
        @foreach($sale['sale_items'] as $item)
        <tr>
            <td>{{ $item['product']['name'] }}</td>
            <td>
                {{ round($item['unit_price'] * $dolar, 2) }} Bs.
            </td>
            <td>{{ $getMeasurementSuffix($item['product']['measurement'], $item['quantity']) }}</td>
            <td>
                {{ round(($item['unit_price'] * $item['quantity']) * $dolar, 2) }} Bs.
            </td>
        </tr>  
        @endforeach
    </table>
    <strong>{{ __('Total') }}:</strong>
    {{ $total }} Bs.
    <br />
    @if($toPay != 0)
    <strong>{{ __('Payed') }}:</strong>
    {{ $payed }} Bs.
    <br />
    @endif
    <strong>----------------------------------------------------------------</strong>
    <br />
    <strong>{{ __('Thank you for your purchase!') }}</strong>
    <br />
    <strong>----------------------------------------------------------------</strong>
</div>
