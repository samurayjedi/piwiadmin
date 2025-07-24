<style>
  .check-label span {
    position: relative;
    top: -3;
  }
</style>
<div class="form-group">
  @foreach ($items as $check)
    @php
      $key = is_array($check) ? $check[0] : $check;
      $display = is_array($check) ? $check[1] : $check;
    @endphp
    <label class="check-label" style="{{ $style ?? '' }}">
      <input
        type="checkbox"
        {{ in_array($key, $value) ? 'checked' : '' }}
      >
      <span>{{ $display }}</span>
    </label>
  @endforeach
</div>
