<style>
  
  .radio-label span {
    position: relative;
    top: -3;
  }
</style>
<div class="radio-group">
  @foreach ($items as $radio)
    @php
      $key = is_array($radio) ? $radio[0] : $radio;
      $display = is_array($radio) ? $radio[1] : $radio;
    @endphp
    <label class="radio-label" style="{{ $style ?? '' }}">
      <input
        type="radio"
        {{ $key === $value ? 'checked' : '' }}
      >
      <span>{{ $display }}</span>
    </label>
  @endforeach
</div>