namespace EstoqueApi.Utils;

public static class DataHoraBrasil
{
    private static readonly TimeZoneInfo Fuso = TimeZoneInfo.FindSystemTimeZoneById("America/Sao_Paulo");
    public static DateTime Agora()
    {
        var horarioLocal = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, Fuso);

        return DateTime.SpecifyKind(horarioLocal, DateTimeKind.Unspecified);
    }
    public static DateTimeOffset ComFuso(DateTime data)
    {
        var dataLocal = DateTime.SpecifyKind(data, DateTimeKind.Unspecified);

        var deslocamento = Fuso.GetUtcOffset(dataLocal);

        return new DateTimeOffset(dataLocal, deslocamento);
    }
}