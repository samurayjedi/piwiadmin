@php
    $path = 'images/logo.png';
    $mimeType = Storage::disk('public')->mimeType($path);
    $base64Image = base64_encode(Storage::disk('public')->get($path));
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
    <strong>{{ __('ID') }}</strong>
    #{{ $sale['id'] }}
    <h2 class="title">{{ __('SALE INVOICE') }}</h2>
    <p class="shop-name">Mi tiendita</p>
    <strong>{{ __('Phone') }}:</strong>
    0414-0000000
    <br />
    <br />
    <img class="logo" src="data:{{$mimeType}};base64,{{$base64Image}}">
    <br />
    <strong>{{ __('Attends') }}:</strong>
    {{ $user }}
    <br />
    <strong>{{ __('Client') }}:</strong>
    {{ $client }}
    <table>
        <tr>
            <td><strong>{{ __('Products') }}</strong></td>
            <td><strong>{{ __('Price') }}</strong></td>
            <td><strong>{{ __('Quantity') }}</strong></td>
            <td><strong>{{ __('Subtotal' ) }}</strong></td>
        </tr>
        @foreach($saleItems as $item)
        <tr>
            <td>{{ $item['product']['name'] }}</td>
            <td>
                {{ $item['unit_price'] * $dolar }} Bs.
            </td>
            <td>x{{ $item['quantity'] }}</td>
            <td>
                {{ ($item['unit_price'] * $item['quantity']) * $dolar }} Bs.
            </td>
        </tr>  
        @endforeach
    </table>
    <strong>{{ __('Total') }}:</strong>
    {{ $sale['total_amount'] * $dolar }} Bs.
    <br />
    @if($sale['status'] === 'pending')
    <strong>{{ __('To pay') }}:</strong>
    {{ ($sale['total_amount'] * $dolar) - ($sale['amount_paid'] * $dolar) }} Bs.
    <br />
    @endif
    <strong>----------------------------------------------------------------</strong>
    <br />
    <strong>{{ __('Thank you for your purchase') }}</strong>
    <br />
    <strong>----------------------------------------------------------------</strong>
</div>
