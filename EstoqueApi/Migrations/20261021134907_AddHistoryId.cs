using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EstoqueApi.Migrations
{
    /// <inheritdoc />
    public partial class AddHistoryId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProdutoIdHistorico",
                table: "MovimentarEstoque",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProdutoIdHistorico",
                table: "ItensVenda",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProdutoIdHistorico",
                table: "MovimentarEstoque");

            migrationBuilder.DropColumn(
                name: "ProdutoIdHistorico",
                table: "ItensVenda");
        }
    }
}
