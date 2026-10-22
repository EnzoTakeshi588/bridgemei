using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EstoqueApi.Migrations
{
    /// <inheritdoc />
    public partial class ConfigDeleteProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItensVenda_Produtos_ProdutoId",
                table: "ItensVenda");

            migrationBuilder.DropForeignKey(
                name: "FK_MovimentarEstoque_Produtos_ProdutoId",
                table: "MovimentarEstoque");

            migrationBuilder.DropForeignKey(
                name: "FK_MovimentarEstoque_Vendas_VendaId",
                table: "MovimentarEstoque");

            migrationBuilder.DropIndex(
                name: "IX_MovimentarEstoque_VendaId",
                table: "MovimentarEstoque");

            migrationBuilder.AlterColumn<int>(
                name: "ProdutoId",
                table: "MovimentarEstoque",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "NomeProduto",
                table: "MovimentarEstoque",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<int>(
                name: "ProdutoId",
                table: "ItensVenda",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "NomeProduto",
                table: "ItensVenda",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_ItensVenda_Produtos_ProdutoId",
                table: "ItensVenda",
                column: "ProdutoId",
                principalTable: "Produtos",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_MovimentarEstoque_Produtos_ProdutoId",
                table: "MovimentarEstoque",
                column: "ProdutoId",
                principalTable: "Produtos",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItensVenda_Produtos_ProdutoId",
                table: "ItensVenda");

            migrationBuilder.DropForeignKey(
                name: "FK_MovimentarEstoque_Produtos_ProdutoId",
                table: "MovimentarEstoque");

            migrationBuilder.DropColumn(
                name: "NomeProduto",
                table: "MovimentarEstoque");

            migrationBuilder.DropColumn(
                name: "NomeProduto",
                table: "ItensVenda");

            migrationBuilder.AlterColumn<int>(
                name: "ProdutoId",
                table: "MovimentarEstoque",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ProdutoId",
                table: "ItensVenda",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MovimentarEstoque_VendaId",
                table: "MovimentarEstoque",
                column: "VendaId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItensVenda_Produtos_ProdutoId",
                table: "ItensVenda",
                column: "ProdutoId",
                principalTable: "Produtos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MovimentarEstoque_Produtos_ProdutoId",
                table: "MovimentarEstoque",
                column: "ProdutoId",
                principalTable: "Produtos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MovimentarEstoque_Vendas_VendaId",
                table: "MovimentarEstoque",
                column: "VendaId",
                principalTable: "Vendas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
